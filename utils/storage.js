import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("courierToken", token);
};

export const saveCourier = async (courier) => {
  await AsyncStorage.setItem(
    "courierUser",
    JSON.stringify(courier)
  );
};

export const getToken = async () => {
  return await AsyncStorage.getItem("courierToken");
};

export const logout = async () => {
  await AsyncStorage.clear();
};