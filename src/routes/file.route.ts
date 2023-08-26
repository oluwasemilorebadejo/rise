import express, { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import {
  uploadFile,
  downloadFile,
  markUnsafe,
  getAllFiles,
  createFolder,
} from "../controllers/file.controller";
import { uploadSingle } from "../middleware/multer";

const router: Router = express.Router();

router.use(protect);

router.post("/upload", uploadSingle, uploadFile);
router.get("/download/:fileName", downloadFile);
router.post("/folder", createFolder);

router.use(restrictTo("admin"));

router.get("/", getAllFiles);

router.patch("/mark-unsafe", markUnsafe);

export default router;
