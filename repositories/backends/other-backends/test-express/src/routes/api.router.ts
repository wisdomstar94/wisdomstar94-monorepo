import { Router } from "express";
import {
  testRouter,
  // otherRouter
} from "./api-router/index.js";

const router = Router();

// /api/test/**/*
router.use("/test", testRouter);

// /api/other/**/*
// router.use("/other", otherRouter);

export const apiRouter = router;
