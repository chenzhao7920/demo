import { Router } from 'express';
import { fileUploads }  from "./file_upload.js"
const router = Router();

router.use(fileUploads);


export default router
