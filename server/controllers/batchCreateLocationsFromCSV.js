// Import PrismaClient from @prisma/client
import { PrismaClient,Prisma} from '@prisma/client';
import { parse } from "fast-csv";
//const { Readable } = require('stream');
// Create a new instance of PrismaClient
const prisma = new PrismaClient();
export const batchCreateLocationsFromCSV = (req, res) =>{
    const { file } = req
    console.log("req",req)
    console.log("file",file)
    if(file?.mimetype !== 'text/csv'){
        res.status(400).json({message: "not valid csv file"});
    }
    if(file.size > 500 * 1024){
        res.status(400).json({message: "not valid file size, must less then 500KB"});
    }

    // file.Body.pipe(parse({ headers: true, discardUnmappedColumns: true, ignoreEmpty: true, trim: true }))
    // .on("data", async (row: any) => {
    //   await profileQueue.add("createOneProfile", row, { removeOnComplete: true, removeOnFail: true });
    //   data.push(row);
    // })
    // .once("end", async function () {
    //   await profileQueue.add("end", {}, { delay: 2000, removeOnComplete: true, removeOnFail: true });
    //   return resolve({ message: "File is read successfully, batch creation request is submitted", data });
    // })
    // .once("error", function (error: any) {
    //   return reject(new Error(error.message));
    // });
    return res.json({message: file.originalname})
}