import { Router } from "express";
import { setTimeout } from "node:timers/promises";

const router = Router();

// /api/test/test1
router.get("/test1", async (req, res) => {
  console.log("req.headers", req.headers);

  res.json({
    tag: "#1 2",
    path: req.path,
    timestamp: Date.now(),
  });
  return;
});

// /api/test/test2
router.get("/test2", async (req, res) => {
  console.log("req.headers", req.headers);

  throw { errorCode: "zzz", errorMessage: "에러 캐치 테스트" };

  res.json({
    tag: "2",
    path: req.path,
    timestamp: Date.now(),
  });
  return;
});

// /api/test/list
router.get("/list", async (req, res) => {
  console.log(`${req.originalUrl} 으로 요청 옴`, new Date());

  await setTimeout(3000);

  res.json({
    data: [
      { name: "홍길동", age: 24, timestamp: Date.now() },
      { name: "홍길동2", age: 27, timestamp: Date.now() },
    ],
    timestamp: Date.now(),
  });
  return;
});

export const testRouter = router;
