import './env-load.js';
import express from 'express';
import { apiRouter } from './routes/index.js';
import { corsMiddleware, globalErrorHandlerMiddleware } from './middlewares/index.js';

const EXPRESS_LISTEN_PORT = 3010;

// create express app
const app = express();

// cors 미들웨어 설정
corsMiddleware(app);

// /api/**/*
app.use('/api', apiRouter);

// global error handler 미들웨어 설정
app.use(globalErrorHandlerMiddleware);

// start socket listen
app.listen(Number(EXPRESS_LISTEN_PORT), () => {
  console.log(`test-express listening, ${EXPRESS_LISTEN_PORT} port...`);
});
