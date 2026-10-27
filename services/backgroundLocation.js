import { Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "./api";

export const BACKGROUND_LOCATION_TASK = "hooks-courier-background-location";

const DISCLOSURE_KEY = "backgroundLocationExplained";

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data?.locations?.length) return;

  const latest = data.locations[data.locations.length - 1];

  try {
    const token = await AsyncStorage.getItem("courierToken");

    if (!token) return;

    await API.put(
      "/api/courier/location",
      {
        lat: latest.coords.latitude,
        lng: latest.coords.longitude,
        heading: latest.coords.heading ?? 0,
        speed: latest.coords.speed ?? 0,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (e) {
    console.log("Background location update failed", e?.message);
  }
});

const explain = () =>
  new Promise((resolve) =>
    Alert.alert(
      "Share your location while online",
      "Hooks Delivery Partner collects your location while you are online or on a delivery, even when the app is closed or the phone is locked. We use it to offer you nearby deliveries and to show the customer where their order is. Location sharing stops when you go offline. On the next screen choose Allow all the time.",
      [
        { text: "Not now", style: "cancel", onPress: () => resolve(false) },
        { text: "Continue", onPress: () => resolve(true) },
      ],
      { cancelable: false }
    )
  );

export const startBackgroundLocation = async () => {
  if (Platform.OS === "web") return false;

  try {
    const current = await Location.getBackgroundPermissionsAsync();

    let granted = current.status === "granted";

    if (!granted && current.canAskAgain) {
      const told = await AsyncStorage.getItem(DISCLOSURE_KEY);

      if (!told) {
        const agreed = await explain();

        await AsyncStorage.setItem(DISCLOSURE_KEY, "1");

        if (!agreed) return false;
      }

      granted = (await Location.requestBackgroundPermissionsAsync()).status === "granted";
    }

    if (!granted) return false;

    if (await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)) return true;

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 15000,
      distanceInterval: 30,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Hooks Delivery Partner",
        notificationBody: "Sharing your location while you are online",
        notificationColor: "#F97316",
      },
    });

    return true;
  } catch (e) {
    console.log("Could not start background location", e?.message);
    return false;
  }
};

export const stopBackgroundLocation = async () => {
  if (Platform.OS === "web") return;

  try {
    if (await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  } catch (e) {
    console.log("Could not stop background location", e?.message);
  }
};
