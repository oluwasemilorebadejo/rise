import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError";
import globalErrorHandler from "./middleware/globalErrorHandler";

import authRouter from "./routes/auth.route";
import fileRouter from "./routes/file.route";

const app = express();

// Log environment variable
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);

app.use(express.json());

app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/files", fileRouter);

// route error handler
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
