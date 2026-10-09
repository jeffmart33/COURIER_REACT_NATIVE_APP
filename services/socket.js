import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io(
  "https://api.getcoredispatch.cloud",
  {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    auth: (cb) => {
      AsyncStorage.getItem("courierToken")
        .then((token) => cb({ token: token || "" }))
        .catch(() => cb({ token: "" }));
    },
  }
);

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem("courierToken");

  if (token && !socket.connected) {
    socket.connect();
  }
};

export default socket;
