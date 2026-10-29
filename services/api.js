import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://api.getcoredispatch.cloud",
  timeout: 10000,
});

let leaving = false;

let signedOut = null;

export const whenSignedOut = (handler) => {
  signedOut = handler;
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const sentToken = String(error.config?.headers?.Authorization || "").startsWith("Bearer ");

    if (error.response?.status === 401 && sentToken && !leaving) {
      leaving = true;

      await AsyncStorage.multiRemove(["courierToken", "courierUser"]).catch(() => null);

      signedOut?.();

      setTimeout(() => {
        leaving = false;
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default API;