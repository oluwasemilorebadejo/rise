import express, { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import { uploadFile } from "../controllers/file.controller";
import { uploadSingle } from "../middleware/multer";

const router: Router = express.Router();

router.use(protect);

router.post("/upload", uploadSingle, uploadFile);

export default router;
