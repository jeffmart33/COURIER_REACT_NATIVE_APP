import { Alert } from "react-native";
import * as Location from "expo-location";

export const LOCATION_DISCLOSURE =
  "Hooks Delivery Partner collects your location while you are online or on a delivery, even when the app is closed or not in use and when the phone is locked. We use it to offer you nearby deliveries, to guide you on the map and to show the customer and Hooks where the order is. We share it only with Hooks and the customer of your delivery. Location sharing stops when you go offline.";

export const explainLocation = (title, message) =>
  new Promise((resolve) =>
    Alert.alert(
      title,
      message,
      [
        { text: "Not now", style: "cancel", onPress: () => resolve(false) },
        { text: "Continue", onPress: () => resolve(true) },
      ],
      { cancelable: false }
    )
  );

let asking = null;

const askOnce = async () => {
  const current = await Location.getForegroundPermissionsAsync();

  if (current.status === "granted" || !current.canAskAgain) return current;

  const agreed = await explainLocation("Hooks uses your location", LOCATION_DISCLOSURE);

  if (!agreed) return { status: "denied", canAskAgain: true };

  return Location.requestForegroundPermissionsAsync();
};

export const askForegroundLocation = () => {
  if (!asking) {
    asking = askOnce().finally(() => {
      asking = null;
    });
  }

  return asking;
};
