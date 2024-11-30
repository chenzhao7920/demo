import { Router } from 'express';
import { fileUploads }  from "./file_upload.js"
import { locations } from "./locations.js"
const router = Router();

router.use(fileUploads);
router.use(locations);
export default router
