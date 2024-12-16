import "./env-load.js";
import express from "express";
import http from "http";
import { apiRouter } from "./routes/index.js";
import { corsMiddleware, globalErrorHandlerMiddleware } from "./middlewares/index.js";
import { socket } from "./socket.js";

const EXPRESS_LISTEN_PORT = 3040;

// create express app
const app = express();

// cors 미들웨어 설정
corsMiddleware(app);

// /api/**/*
app.use("/api", apiRouter);

// global error handler 미들웨어 설정
app.use(globalErrorHandlerMiddleware);

// convert to server
const server = http.createServer(app);

// socket setting in server
socket(server);

// start socket listen
server.listen(Number(EXPRESS_LISTEN_PORT), () => {
  console.log(`test-socket listening, ${EXPRESS_LISTEN_PORT} port...`);
});
