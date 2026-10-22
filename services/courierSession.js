import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import socket from "./socket";
import { registerForPushNotifications } from "./notifications";

export const finishLogin = async (data) => {
  await AsyncStorage.setItem("courierToken", data.token);

  await AsyncStorage.setItem("courierUser", JSON.stringify(data.courier));

  await AsyncStorage.setItem("courierId", String(data.courier.id));

  await registerForPushNotifications(data.token);

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("register-courier", data.courier.id);

  router.replace("/courierdashboard");
};
