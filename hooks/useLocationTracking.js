import {
  useEffect,
  useRef,
} from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";




const calculateDistance = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const R = 6371e3;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;

  const Δφ =
    ((lat2 - lat1) * Math.PI) / 180;

  const Δλ =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
};



export default function useLocationTracking({
  online,
  setLocation,
  activeOrder,
  orderStage,
  setOrderStage,
}) {

  const arrivalUpdatingRef = useRef(false);

  const hasActiveOrder = Boolean(activeOrder);

  useEffect(() => {
    arrivalUpdatingRef.current = false;
  }, [orderStage, activeOrder?._id]);

  useEffect(() => {
    if (!online && !hasActiveOrder) return;

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
              timeInterval: 15000,
              distanceInterval: 30,
            },
            async (position) => {
              const {
  latitude,
  longitude,
  heading,
  speed,
  accuracy,
  altitude,
} = position.coords;

setLocation({
  lat: latitude,
  lng: longitude,
  heading: heading ?? 0,
  speed: speed ?? 0,
  accuracy: accuracy ?? 0,
  altitude: altitude ?? 0,
  timestamp: Date.now(),
});

              try {
                const token =
                  await AsyncStorage.getItem(
                    "courierToken"
                  );

               await API.put(
  "/api/courier/location",
  {
    lat: latitude,
    lng: longitude,
    heading: heading ?? 0,
    speed: speed ?? 0,
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

/* ================= AUTOMATIC ARRIVAL DETECTION ================= */

if (activeOrder) {

  let target = null;
  let nextStage = null;
  let nextStatus = null;

  /*
   * HEADING TO RESTAURANT
   *
   * Check whether courier has reached
   * the restaurant.
   */
  if (
    orderStage === "Heading to Restaurant" &&
    activeOrder.pickupLocation?.coordinates
  ) {

    const [
      targetLng,
      targetLat,
    ] = activeOrder.pickupLocation.coordinates;

    target = {
      lat: targetLat,
      lng: targetLng,
    };

    nextStage = "Arrived at Restaurant";
    nextStatus = "arrived_pickup";
  }

  /*
   * PICKED UP
   *
   * Check whether courier has reached
   * the customer.
   */
if (
  orderStage === "On the Way" &&
  activeOrder.dropoffLocation?.coordinates
) {
  
    const [
      targetLng,
      targetLat,
    ] = activeOrder.dropoffLocation.coordinates;

    target = {
      lat: targetLat,
      lng: targetLng,
    };

    nextStage = "Arrived at Customer Address";
nextStatus = "arrived_delivery";
  }

  if (
  target &&
  nextStage &&
  nextStatus &&
  !arrivalUpdatingRef.current
) {

    const distance = calculateDistance(
      latitude,
      longitude,
      target.lat,
      target.lng
    );

    console.log(
      "Delivery arrival distance:",
      Math.round(distance),
      "meters"
    );

    /*
     * 100 meters arrival radius.
     */
    if (distance <= 100) {

      arrivalUpdatingRef.current = true;

      console.log(
        "ARRIVAL DETECTED:",
        nextStage
      );

      try {

        const token =
          await AsyncStorage.getItem(
            "courierToken"
          );

        await API.put(
          `/api/orders/${activeOrder._id}/status`,
          {
            status: nextStatus,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setOrderStage(nextStage);

} catch (error) {

  arrivalUpdatingRef.current = false;

  console.log(
    "Automatic arrival status update failed:",
    error.response?.data ||
    error.message
  );

}
    }
  }
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
  }, [
  online,
  hasActiveOrder,
  activeOrder,
  orderStage,
  setOrderStage,
]);
}