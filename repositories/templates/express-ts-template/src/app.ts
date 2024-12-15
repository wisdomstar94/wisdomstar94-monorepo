import express from "express";
import { apiRouter } from "./routes/index.js";
import { corsMiddleware, globalErrorHandlerMiddleware } from "./middlewares/index.js";

const EXPRESS_LISTEN_PORT = 3030;

const app = express();

// cors 미들웨어 설정
corsMiddleware(app);

// /api/**/*
app.use("/api", apiRouter);

// global error handler 미들웨어 설정
app.use(globalErrorHandlerMiddleware);

app.listen(Number(EXPRESS_LISTEN_PORT), () => {
  console.log(`express listening, ${EXPRESS_LISTEN_PORT} port...`);
});
