import { io } from "socket.io-client";

const socket = io(
  "https://api.getcoredispatch.cloud",
  {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  }
);

export default socket;