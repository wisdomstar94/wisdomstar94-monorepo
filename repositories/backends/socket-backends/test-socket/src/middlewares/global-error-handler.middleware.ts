import type { NextFunction, Request, Response } from "express";

export async function globalErrorHandlerMiddleware(err: unknown, req: Request, res: Response, _: NextFunction) {
  console.error("@globalErrorHandlerMiddleware.req.originalUrl", req.originalUrl);
  console.error("@globalErrorHandlerMiddleware.err", err);

  res.status(500).json({
    timestamp: new Date(),
  });
  return;
}
