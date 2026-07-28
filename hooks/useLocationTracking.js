import { useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function useLocationTracking({
  online,
  setLocation,
}) {
  useEffect(() => {
    if (!online) return;

    let locationSubscription = null;

    const startTracking = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        locationSubscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              setLocation({
                lat,
                lng,
              });

              try {
                const token =
                  await AsyncStorage.getItem(
                    "courierToken"
                  );

                await API.put(
                  "/api/courier/location",
                  {
                    lat,
                    lng,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              } catch (error) {
                console.log(
                  "Location update failed",
                  error
                );
              }
            }
          );
      } catch (error) {
        console.log(
          "GPS tracking failed",
          error
        );
      }
    };

    startTracking();

    return () => {
      locationSubscription?.remove();
    };
  }, [online]);
}