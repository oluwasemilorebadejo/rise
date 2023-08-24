import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const handleValidationErrorDB = (err: any) => {
  const formattedMessage = err.details[0].message;
  return new AppError(formattedMessage, 400);
};

const sendErrorDev = (err: any, req: Request, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    // expected errors, send err to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // programming errors, don't send details to client
    console.error("ERROR", err);

    return res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.stack.startsWith("ValidationError"))
      err = handleValidationErrorDB(err);

    sendErrorProd(err, req, res);
  }
};
