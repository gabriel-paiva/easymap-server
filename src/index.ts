import { Server } from "socket.io";

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = {
  x: number;
  y: number;
};

type DrawLine = {
  previousPoint: Point | null;
  currentPoint: Point;
  color: string;
};

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", ({ previousPoint, currentPoint, color }: DrawLine) => {
    socket.broadcast.emit("draw-line", { previousPoint, currentPoint, color });
  });

  socket.on("clear", () => {
    socket.broadcast.emit("clear");
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
