import { PrismaClient, locations } from '@prisma/client';
import { parse } from "fast-csv";
import { Readable } from 'stream';

const prisma = new PrismaClient();
export const batchCreateLocationsFromCSV = async(req: any, res: any) =>{
    const { file } = req
    if(file?.mimetype !== 'text/csv'){
        res.status(400).json({message: "not valid csv file"});
    }
    if(file.size > 500 * 1024){
        res.status(400).json({message: "not valid file size, must less then 500KB"});
    }

    const job_queue: any = []
    const BATCH_LIMIT = 5
    try{
        const stream = Readable.from(file.buffer)
        stream.pipe(parse({headers: true,  discardUnmappedColumns: true, ignoreEmpty: true, trim: true}))
            .on("data", async (row) => {
                job_queue.push(row)
                if(job_queue.length >= BATCH_LIMIT){
                    let jobs = job_queue.splice(0,BATCH_LIMIT)
                    await createManyLocations(jobs)
                }
            })
            .once("end", async()=>{
                console.log("on end")
                if(job_queue.length){
                    await createManyLocations(job_queue);
                }
                // await profileQueue.add("end", {}, { delay: 2000, removeOnComplete: true, removeOnFail: true });
                //return resolve({ message: "File is read successfully, batch creation request is submitted", data });
            })
            .once("error", (err)=>{
                console.error("Error processing CSV:", err);
               //return reject(new Error(error.message));
            });
            return res.json({message: `We are working on loading data from ${file.originalname}`})
    }catch(err){
        return res.json({message: file.originalname})
    }
}
const createManyLocations = async(rows:any) =>{
   // let {street, city, zip_code, county, latitude, longtitude, time_zone}  =
    let promises = []
    rows.forEach((row:any)=>{
        promises.push()
    })
    setTimeout(()=>{
        console.log("5 line data",rows)
    }, 1000)
   // await locations.create
}