import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import API from "./api";
import { googleAccessToken } from "./googleSignIn";
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

export const continueWithGoogle = async (open = router.push) => {
  const accessToken = await googleAccessToken();

  if (!accessToken) return;

  const response = await API.post("/api/auth/google", {
    access_token: accessToken,
  });

  if (response.data.needsProfile) {
    open({
      pathname: "/createaccount",
      params: {
        googleToken: accessToken,
        email: response.data.email,
        fullName: response.data.fullName || "",
      },
    });
    return;
  }

  await finishLogin(response.data);
};
