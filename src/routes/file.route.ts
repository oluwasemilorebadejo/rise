import express, { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import { uploadFile, downloadFile } from "../controllers/file.controller";
import { uploadSingle } from "../middleware/multer";

const router: Router = express.Router();

router.use(protect);

router.post("/upload", uploadSingle, uploadFile);
router.get("/download/:fileName", downloadFile);

export default router;
