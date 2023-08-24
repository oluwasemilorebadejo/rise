import express, { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import {
  signUpValidationMiddleware,
  logInValidationMiddleware,
} from "../validators/auth.validator";

const router: Router = express.Router();

router.post("/signup", signUpValidationMiddleware, signup);
router.post("/login", logInValidationMiddleware, login);

export default router;
