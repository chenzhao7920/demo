import { PrismaClient, locations } from '@prisma/client';
import { parse } from "fast-csv";
import { Readable } from 'stream';

const prisma = new PrismaClient();
export const batchCreateLocationsFromCSV = async(req: any, res: any) =>{
    const { file } = req
    const job_queue: any = []
    const BATCH_LIMIT = 20
    try{
        const stream = Readable.from(file.buffer)
        stream.pipe(parse({headers: true,  discardUnmappedColumns: true, ignoreEmpty: true, trim: true}))
            .on("data", async(row) => {
                //console.log("data",row)
                job_queue.push(row)
                if(job_queue.length >= BATCH_LIMIT){
                    let jobs = job_queue.splice(0,BATCH_LIMIT)
                    setTimeout(async()=>{
                        await createManyLocations(jobs);
                    },500)
                }
            })
            .once("end", async()=>{
                if(job_queue.length){
                    await createManyLocations(job_queue);
                }
            })
            .once("error", (err)=>{
                res.status(400).json({message: `Error processing CSV: ${file.originalname}, ${err}`})
            });
            return res.status(200).json({message: `We are working on loading data from ${file.originalname}`})
    }catch(err){
        return res.json({message: file.originalname})
    }
}
const createManyLocations = async(locations:any) =>{
    try{
        const fail_created:any = []
        prisma.$transaction(async(tx:any) =>{
            const cities = await Promise.allSettled(
                locations.map((location: any) => {
                    return tx.cities.upsert({
                        create:{name: location.city},
                        where:{name: location.city},
                        update:{name: location.city,updatedAt: new Date()},
                    })
                })
            )
            const counties = await Promise.allSettled(
                locations.map((location: any)=>{
                    return tx.counties.upsert({
                        create:{name: location.county},
                        where:{name: location.county},
                        update:{name: location.county,updatedAt: new Date()}
                    })
                })
            )
            const countries = await Promise.allSettled(
                locations.map((location:any)=>{
                    return tx.countries.upsert({
                        create:{name: location.country},
                        where:{name: location.country},
                        update:{name: location.country,updatedAt: new Date()}
                    })
                })
            )

            const timezones = await Promise.allSettled(
                locations.map((location:any)=>{
                    return tx.timezones.upsert({
                        create:{name: location.time_zone},
                        where:{name: location.time_zone},
                        update:{name: location.time_zone,updatedAt: new Date()},

                    })
                })
            )

            const locationsToCreate = locations.map((location:any, idx: number) =>{
                if(counties[idx].status === 'fulfilled' &&
                    cities[idx].status === 'fulfilled' &&
                    countries[idx].status === 'fulfilled' &&
                    timezones[idx].status === 'fulfilled'
                )
                return {
                    street: location.street,
                    zip_code: location.zip_code,
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    city_id: cities[idx].value.id,
                    county_id: counties[idx].value.id,
                    country_id: countries[idx].value.id,
                    timezone_id: timezones[idx].value.id
                }
                if(counties[idx].status === 'rejected' ||
                    cities[idx].status === 'rejected' ||
                    countries[idx].status === 'rejected' ||
                    timezones[idx].status === 'rejected'
                    ){
                       fail_created.push(location)
                    }
            })

            //await tx.locations.createMany({data: locationsToCreate})
            const created_locations = await Promise.allSettled(
                locationsToCreate.map((location:any)=>{
                    return tx.locations.upsert({
                        where:{ street_latitude_longitude: {
                            street: location?.street,
                            latitude: location?.latitude,
                            longitude: location?.longitude
                            }},
                        update:{
                            street: location?.street,
                            latitude: location?.latitude,
                            longitude: location?.longitude,
                            updatedAt: new Date()
                        },
                        create:{...location}
                    })
                })
            )
            console.log(fail_created)
            return created_locations
        },{
            timeout: 30000 // Increase timeout to 30 seconds (default is 5 seconds)
        })

    }catch(err){
        console.log(err)
        throw(err)
    }
}