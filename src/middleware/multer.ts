import multer from "multer";
import { Request, Response } from "express";

const validFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "text/csv",
  "audio/mpeg",
  "audio/mp4",
  "audio/mp3",
  "audio/ogg",
  "audio/vnd.wav",
  "audio/wave",
  "video/mp4",
  "video/3gpp",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/x-flv",
  "application/pdf",
  "text/plain",
];

// Multer configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (validFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

// Configure the multer instance
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 5 MB file size limit
  },
});

export const uploadSingle = upload.single("file");
