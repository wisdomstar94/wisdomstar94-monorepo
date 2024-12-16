import http from "http";
import { Server } from "socket.io";

const BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN = process.env.BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN ?? "";

export function socket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN.split(",").map((x) => x.trim()),
      methods: ["GET", "POST"],
    },
  });

  setInterval(() => {
    io.sockets.fetchSockets().then((result) => {
      console.log(`연결 된 소켓 갯수`, result.length);
      result.forEach((s) => {
        s.emit("my-event", { name: "홍길동", t: Date.now() });
      });
    });
  }, 1000);

  // users 네임스페이스
  const usersIo = io.of("/users");
  let usersIoInterval: NodeJS.Timeout | undefined = undefined;
  usersIo.on("connection", (socket) => {
    // throw 'test';
    console.log("[/users] New client connected!!", socket.id);

    clearInterval(usersIoInterval);
    usersIoInterval = setInterval(() => {
      usersIo.fetchSockets().then((result) => {
        console.log(`[usersIo] 연결 된 소켓 갯수`, result.length);
        result.forEach((s) => {
          s.emit("user:list", { list: [{ name: "ㅋㅋㅋ", age: 27, t: Date.now() }] });
        });
      });
    }, 1000);

    socket.on("user-event", (data) => {
      console.log("@user-event", data);
    });
  });

  // / 루트 네임스페이스
  let rootIoInterval: NodeJS.Timeout | undefined = undefined;
  io.on("connection", async (socket) => {
    console.log("[/] New client connected!!", socket.id);

    clearInterval(rootIoInterval);
    rootIoInterval = setInterval(() => {
      io.fetchSockets().then((result) => {
        console.log(`[rootIo] 연결 된 소켓 갯수`, result.length);
        result.forEach((s) => {
          s.emit("user:list", { list: [{ name: "ㅎㅎㅎ", age: 27, t: Date.now() }] });
        });
      });
    }, 1000);

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
    });
  });
}
