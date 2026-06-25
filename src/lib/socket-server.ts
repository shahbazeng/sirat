import { Server } from "socket.io";

export const initSocket = (res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  return res.socket.server.io;
};