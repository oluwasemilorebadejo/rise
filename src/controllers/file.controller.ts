import { NextFunction, Request, Response } from "express";
import { Dropbox } from "dropbox";
import File from "../models/file.model";
import fs from "fs";
import { Readable } from "stream";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

// Dropbox configuration
const dbx = new Dropbox({ accessToken: process.env.ACCESS_TOKEN });

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileContent = req.file.buffer;
    const fileName = req.file.originalname;

    const uploadResponse = await dbx.filesUpload({
      path: `/${fileName}`,
      contents: fileContent,
    });

    // console.log(uploadResponse);

    const file = await File.create({
      id: req.body.id,
      name: fileName,
      mimeType: req.file.mimetype,
      path: "/",
      status: req.body.status,
      user: res.locals.user.id,
      type: "file",
    });

    return res.status(200).json({
      data: {
        message: "File uploaded sucessfully",
        file,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while uploading the file" });
  }
});

export const downloadFile = catchAsync(async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;

    const downloadResponse = await dbx.filesDownload({ path: `/` });

    const fileContents: Buffer = downloadResponse.result as unknown as Buffer;

    const fileStream = new Readable();
    fileStream.push(fileContents);
    fileStream.push(null);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while downloading the file" });
  }
});

export const markUnsafe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileId = req.body.fileId;

    // Find the file by its ID
    const file = await File.findByPk(fileId);

    if (!file) {
      return next(new AppError("file not found", 404));
    }

    // Update the status of the file to "unsafe"
    file.status = "unsafe";
    await file.save();

    res.status(200).json({
      status: "success",
      message: "File status updated to unsafe",
      data: {
        file,
      },
    });
  }
);

export const createFolder = catchAsync(async (req: Request, res: Response) => {
  const folderName = req.body.folderName;

  const createFolderResponse = await dbx.filesCreateFolderV2({
    path: `/${folderName}`,
  });

  // console.log(createFolderResponse);

  const file = await File.create({
    id: req.body.id,
    name: folderName,
    mimeType: "folder",
    path: "/",
    status: req.body.status,
    user: res.locals.user.id,
    type: "folder",
  });

  return res.status(200).json({ message: "Folder created successfully" });
});

export const getAllFiles = catchAsync(async (req: Request, res: Response) => {
  const files = await File.findAll();

  return res.status(200).json({
    data: {
      files,
    },
  });
});

export const deleteUnsafeFiles = async (): Promise<void> => {
  try {
    // Find all files with status "unsafe"
    const unsafeFiles = await File.findAll({
      where: {
        status: "unsafe",
      },
    });

    // Delete each unsafe file from Dropbox and database
    for (const file of unsafeFiles) {
      // Delete file from Dropbox
      await dbx.filesDeleteV2({ path: `/${file.name}` });

      // Delete file from database
      await file.destroy();
    }

    console.log("Unsafe files deleted successfully");
  } catch (error) {
    console.error("Error deleting unsafe files:", error);
  }
};
