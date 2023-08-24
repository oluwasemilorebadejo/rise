import { Request, Response } from "express";
import { Dropbox } from "dropbox";
import File from "../models/file.model";

// Dropbox configuration
const dbx = new Dropbox({ accessToken: process.env.ACCESS_TOKEN });

export const uploadFile = async (req: Request, res: Response) => {
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

    console.log(uploadResponse);

    const file = await File.create({
      id: req.body.id,
      name: fileName,
      mimeType: req.file.mimetype,
      path: "dummy",
      status: req.body.status,
      user: res.locals.user,
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
};
