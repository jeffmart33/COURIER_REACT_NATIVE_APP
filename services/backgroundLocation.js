import { Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "./api";
import { askForegroundLocation, explainLocation, LOCATION_DISCLOSURE } from "./locationConsent";

export const BACKGROUND_LOCATION_TASK = "hooks-courier-background-location";

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

export const startBackgroundLocation = async () => {
  if (Platform.OS === "web") return false;

  try {
    const foreground = await askForegroundLocation();

    if (foreground.status !== "granted") return false;

    const current = await Location.getBackgroundPermissionsAsync();

    let granted = current.status === "granted";

    if (!granted && current.canAskAgain) {
      const agreed = await explainLocation(
        "Share your location while online",
        `${LOCATION_DISCLOSURE} On the next screen choose Allow all the time.`
      );

      if (!agreed) return false;

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
