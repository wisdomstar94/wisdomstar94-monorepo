import type { Express } from "express";
import cors from "cors";

export function corsMiddleware(app: Express) {
  const corsWhiteList = ["http://localhost:3000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        // if (typeof origin !== "string") {
        //   callback(new Error("Not Exist Origin!")); // cors 비허용
        //   return;
        // }
        if (typeof origin === "string") {
          if (corsWhiteList.indexOf(origin) === -1) {
            callback(new Error("Not Allowed Origin!")); // cors 비허용
            return;
          }
        }
        callback(null, true); // cors 허용
      },
    })
  );
}
