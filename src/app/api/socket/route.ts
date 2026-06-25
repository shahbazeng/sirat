import { initSocket } from "@/lib/socket-server";

export const GET = (req: any, res: any) => {
  const io = initSocket(res);
  
  io.on("connection", (socket: any) => {
    console.log("User Connected:", socket.id);
    
    // Simulate traffic update
    setInterval(() => {
      const active = Math.floor(Math.random() * 50) + 10;
      socket.emit("live-traffic", active);
    }, 3000);
  });

  return new Response("Socket Initialized");
};