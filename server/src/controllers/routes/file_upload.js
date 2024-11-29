import express from "express";
import multer from 'multer'
import { batchCreateLocationsFromCSV } from "../batchCreateLocationsFromCSV.js";

//import { multerUpload } from "../config/multer.config";
const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

export const fileUploads = express.Router();

fileUploads.post("/upload", multerUpload.single("file"),  batchCreateLocationsFromCSV);
