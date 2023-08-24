import express, { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";

const router: Router = express.Router();

router.use(protect);

router.post("/upload");

export default router;
