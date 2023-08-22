import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

// Log environment variable
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);

app.use(express.json());

app.use(cookieParser());

// route error handler
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
