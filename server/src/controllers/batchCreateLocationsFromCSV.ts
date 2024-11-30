import { PrismaClient } from '@prisma/client';
import { parse } from "fast-csv";
import { Readable } from 'stream';
import IORedis from "ioredis"
import { Queue, Worker, Job } from "bullmq";
import  { v4 as uuidv4} from 'uuid'
const prisma = new PrismaClient();
type  Location = {
  id: number;
  street: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  city_id: number;
  country_id: number;
  county_id: number;
  createdAt: Date;
  updatedAt: Date;
  timezone_id: number;
}
type RawLocation = {
  street: string;
  city: string;
  zip_code: string;
  county: string;
  country: string;
  latitude: string;
  longitude: string;
  time_zone: string;
}
export const batchCreateLocationsFromCSV = async(req: any, res: any) =>{
        const { file } = req
        if(file?.mimetype !== 'text/csv'){
            return res.status(400).json({message: "not valid csv file"});
        }
        if(file.size > 500 * 1024){
            return res.status(400).json({message: "not valid file size, must less then 500KB"});
        }
        const redisConnection = new IORedis({
            port: parseInt(process.env.REDIS_PORT || "6379"),
            host: process.env.REDIS_HOST || "localhost",
            maxRetriesPerRequest: null,
        });
        let uuid = uuidv4()
        const job_queue = new Queue(`locations-${uuid}`, { connection: redisConnection });
        const createLocations = async () =>
            new Promise(async (resolve, reject) => {
              const data: any = [];
              try {
                const stream = Readable.from(file.buffer)
                stream.pipe(parse({headers: true,  discardUnmappedColumns: true, ignoreEmpty: true, trim: true}))
                  .on("data", async (row: RawLocation) => {
                    await job_queue.add("createOneLocation", row, { removeOnComplete: true, removeOnFail: true});
                    data.push(row);
                  })
                  .once("end", async function () {
                    await job_queue.add("end", {}, { delay: 2000, removeOnComplete: true, removeOnFail: true });
                    return resolve({ message: "File is read successfully, batch creation request is submitted", data });
                  })
                  .once("error", function (error: any) {
                    return reject(new Error(error.message));
                  });
              } catch (err) {
                return reject(new Error("File does not exist"));
              }
        });
        enum Step {
            Initial,
            Second,
            Finish,
        };
        const worker = new Worker(
            `locations-${uuid}`,
            async (job: Job) => {
              const { name, data }: any = job;
              if (name === "createOneLocation") {
                console.log(`--------------------------------`)
                console.log(`[PROCESSING START]: id ${job.id}`)
                await job.updateData({
                  step: Step.Initial,
                });
                let step = job.data.step;
                while (step !== Step.Finish) {
                  switch (step) {
                    case Step.Initial: {
                      let {success_created, fail_created}: any = await createOneLocation(data)
                      //if(success_created) console.log("success_created",success_created.street)
                      //if(fail_created) console.log("fail_created",fail_created.street)
                      await job.updateData({
                        fail_created,
                        step: Step.Second,
                      });
                      step = Step.Second;
                      break;
                    }
                    case Step.Second: {
                      let { fail_created } = job.data;
                      await createOneLocation(fail_created)
                      await job.updateData({
                        step: Step.Finish,
                      });
                      step = Step.Finish;
                      break;
                    }
                    default: {
                      throw new Error("invalid step");
                    }
                  }
                }
              }
              if (name === "end") {
                // console.log(`--------------------------------`)
                //console.log("[ENDING] Queue went to the end!");
                // console.log(`--------------------------------`)
              }
              return;
            },
            {
              autorun: false, // don't run worker immediately
              connection: redisConnection,
            },
        );

        try {
            const { message, data }: any = await createLocations();
            const headers: any = Object.keys(data[0] ?? {});

            if (!data || data.length === 0) {
              job_queue.drain(true);
            }
            // fail validation, drain out all jobs
            if(!validateHeaders(headers)){
              job_queue.drain(true);
            }
            else {
              // after csv file pass all validation, then run worker
              worker.run();
            }
            return res.status(200).json({message: `We are working on loading data from ${file.originalname}`})
          } catch (error) {
            console.log(error);
            return res.status(500).json({message: "internal errors"})
          }
}
const createOneLocation = async (location: RawLocation): Promise<{ success_created?: Location; fail_created?: RawLocation}> => {
  try {
    // Start the transaction
    return prisma.$transaction(async (tx: any) => {
      // Upsert city, county, country, and timezone
      const city = await tx.cities.upsert({
        create: { name: location.city },
        where: { name: location.city },
        update: { name: location.city, updatedAt: new Date() },
      });

      const county = await tx.counties.upsert({
        create: { name: location.county },
        where: { name: location.county },
        update: { name: location.county, updatedAt: new Date() },
      });

      const country = await tx.countries.upsert({
        create: { name: location.country },
        where: { name: location.country },
        update: { name: location.country, updatedAt: new Date() },
      });

      const timezone = await tx.timezones.upsert({
        create: { name: location.time_zone },
        where: { name: location.time_zone },
        update: { name: location.time_zone, updatedAt: new Date() },
      });

      // Check if all upserts succeeded
      if (city && county && country && timezone) {
        // Create the location with the related entity IDs
        const success_created = await tx.locations.upsert({
          where: {
            street_latitude_longitude: {
              street: location.street,
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            },
          },
          update: {
            street: location.street,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            updatedAt: new Date(),
          },
          create: {
            street: location.street,
            zip_code: location.zip_code,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            city_id: city.id,
            county_id: county.id,
            country_id: country.id,
            timezone_id: timezone.id,
          },
        });
        return { success_created }
      } else {
        console.log('Failed to create location due to missing data');
        return { fail_created: location };
      }
    },{
      timeout: 10000, // 10 seconds timeout
    });

  } catch (err) {
    console.log(err);
    throw err;
  }
};
const validateHeaders = (headers: string[]): boolean =>{
  const HEADERS = ['street', 'city', 'zip_code','county', 'country','latitude', 'longitude', 'time_zone']

  return HEADERS.reduce((isValid: boolean, header: string )=>{
      return isValid = isValid && headers.includes(header)
  },true)

}