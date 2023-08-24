import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import catchAsync from "../utils/catchAsync";

const signUpValidator = Joi.object({
  firstName: Joi.string().alphanum().required().messages({
    "any.required": "Kindly enter your first name",
  }),
  lastName: Joi.string().alphanum().required().messages({
    "any.required": "Kindly enter your first name",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Kindly enter your email address",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 8 and 30 characters and can only contain letters and numbers",
      "any.required": "Kindly enter your password",
    }),
  // role: Joi.string().valid("admin", "user").required().messages({
  //   "any.only": "Role can only be either admin, or user",
  //   "any.required": "Kindly enter your role",
  // }),
});

const logInValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Kindly enter your email address",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 8 and 30 characters and can only contain letters and numbers",
      "any.required": "Kindly enter your password",
    }),
});

// Validation middleware for the inputs
export const signUpValidationMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await signUpValidator.validateAsync(req.body);
    next();
  }
);

export const logInValidationMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await logInValidator.validateAsync(req.body);
    next();
  }
);
