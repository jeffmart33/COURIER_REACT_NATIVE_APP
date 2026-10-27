import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import API from "../services/api";
import { stopBackgroundLocation } from "../services/backgroundLocation";
import socket from "../services/socket";

export default function useAuth({
  setOnline,
}) {

  const handleLogout = async () => {

    try {

      const token =
        await AsyncStorage.getItem(
          "courierToken"
        );

      if (token) {

        await API.put(
          "/api/profile/online",
          {
            online: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

    } catch (error) {

      console.log(
        "Failed to set courier offline:",
        error
      );

    }

    setOnline(false);

    await stopBackgroundLocation();

    await AsyncStorage.multiRemove([
      "courierToken",
      "courierId",
      "courierUser",
    ]);

    socket.disconnect();

    router.replace("/login");
  };

  return {
    handleLogout,
  };
}