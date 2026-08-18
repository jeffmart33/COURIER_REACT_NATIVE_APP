import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import API from "../services/api";

export default function useOrderActions({
  activeOrder,
  orderStage,
  location,
  activeTab,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
  setIncomingOrders,
}) {

const isWithinRadius = (target, radius = 100) => {
  if (
    !target ||
    typeof target.lat !== "number" ||
    typeof target.lng !== "number" ||
    typeof location?.lat !== "number" ||
    typeof location?.lng !== "number"
  ) {
    return false;
  }

  const R = 6371e3;

  const φ1 = (location.lat * Math.PI) / 180;
  const φ2 = (target.lat * Math.PI) / 180;

  const Δφ =
    ((target.lat - location.lat) * Math.PI) / 180;

  const Δλ =
    ((target.lng - location.lng) * Math.PI) / 180;

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
      ) <= radius
  );
};

  const nextStage = async () => {
  if (!activeOrder) return;

const flow = [
  "Assigned",
  "Heading to Restaurant",
  "Arrived at Restaurant",
  "Picked Up",
  "On the Way",
  "Arrived at Customer Address",
  "Delivered",
];

const statusMap = {
  Assigned: "accepted",
  "Heading to Restaurant": "heading_to_restaurant",
  "Arrived at Restaurant": "arrived_restaurant",
  "Picked Up": "picked_up",
  "On the Way": "on_the_way",
  "Arrived at Customer Address": "arrived_customer",
  Delivered: "delivered",
};

  const index = flow.indexOf(orderStage);

  if (index === -1 || index >= flow.length - 1) {
    return;
  }

  const next = flow[index + 1];

  /*
   * ==========================================
   * STRICT LOCATION CHECKS
   * ==========================================
   */

  // ------------------------------------------
  // ASSIGNED → HEADING TO RESTAURANT
  // No location restriction needed.
  // Courier can start navigation.
  // ------------------------------------------

  // ------------------------------------------
  // HEADING TO RESTAURANT → ARRIVED AT RESTAURANT
  // Courier MUST be near the restaurant.
  // ------------------------------------------

  if (orderStage === "Heading to Restaurant") {
    const pickupCoordinates =
      activeOrder.pickupLocation?.coordinates;

    if (
      !pickupCoordinates ||
      pickupCoordinates.length < 2
    ) {
      Alert.alert(
        "Location unavailable",
        "Restaurant location is not available for this order."
      );
      return;
    }

    const restaurantLocation = {
      lng: pickupCoordinates[0],
      lat: pickupCoordinates[1],
    };

    if (!isWithinRadius(restaurantLocation, 100)) {
      Alert.alert(
        "You are not at the restaurant",
        "You must arrive at the restaurant before confirming arrival."
      );
      return;
    }
  }

  // ------------------------------------------
  // ARRIVED AT RESTAURANT → PICKED UP
  // Courier must still be near restaurant.
  // ------------------------------------------

  if (orderStage === "Arrived at Restaurant") {
    const pickupCoordinates =
      activeOrder.pickupLocation?.coordinates;

    if (
      !pickupCoordinates ||
      pickupCoordinates.length < 2
    ) {
      Alert.alert(
        "Location unavailable",
        "Restaurant location is not available for this order."
      );
      return;
    }

    const restaurantLocation = {
      lng: pickupCoordinates[0],
      lat: pickupCoordinates[1],
    };

    if (!isWithinRadius(restaurantLocation, 100)) {
      Alert.alert(
        "You left the restaurant",
        "You must be at the restaurant to confirm pickup."
      );
      return;
    }
  }

  
  // ------------------------------------------
  // ARRIVED AT CUSTOMER → DELIVERED
  // Courier must still be near customer.
  // ------------------------------------------

  if (orderStage === "Arrived at Customer Address") {
    const dropoffCoordinates =
      activeOrder.dropoffLocation?.coordinates;

    if (
      !dropoffCoordinates ||
      dropoffCoordinates.length < 2
    ) {
      Alert.alert(
        "Location unavailable",
        "Customer location is not available for this order."
      );
      return;
    }

    const customerLocation = {
      lng: dropoffCoordinates[0],
      lat: dropoffCoordinates[1],
    };

    if (!isWithinRadius(customerLocation, 100)) {
      Alert.alert(
        "You are not at the customer",
        "You must be at the customer's address before completing the delivery."
      );
      return;
    }
  }

  /*
   * ==========================================
   * LOCATION CHECK PASSED
   * NOW UPDATE THE STAGE
   * ==========================================
   */

  try {
    const token =
      await AsyncStorage.getItem(
        "courierToken"
      );

    const response = await API.put(
      `/api/orders/${activeOrder._id}/status`,
      {
        status: statusMap[next],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    /*
     * Only change the local stage AFTER
     * the backend successfully accepts it.
     */
    setOrderStage(next);

    if (next === "Delivered") {
      setActiveOrder(null);
      setOrderStage("Assigned");
      setActiveTab("Home");
    }

  } catch (error) {

    console.log(
      "Status update failed",
      error
    );

    Alert.alert(
      "Unable to update delivery",
      error.response?.data?.message ||
        "Please try again."
    );
  }
};

  const acceptOrder = async (order) => {
    try {
      const token =
        await AsyncStorage.getItem(
          "courierToken"
        );

      const { data } = await API.put(
        `/api/orders/${order._id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActiveOrder(data.order);

      setOrderStage("Assigned");

      setActiveTab("Orders");

      setIncomingOrders((prev) =>
        prev.filter(
          (o) => o._id !== order._id
        )
      );

    } catch (error) {

      Alert.alert(
        "Error",
        error.response?.data?.message ??
          "Failed to accept order"
      );

    }
  };

  const rejectOrder = async (order) => {
    try {
      const token =
        await AsyncStorage.getItem(
          "courierToken"
        );

      await API.put(
        `/api/orders/${order._id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIncomingOrders((prev) =>
        prev.filter(
          (o) => o._id !== order._id
        )
      );

      if (activeTab === "Requests") {
        setActiveTab("Home");
      }

    } catch (error) {
      console.log(
        "Reject order failed",
        error
      );
    }
  };

  return {
    isWithinRadius,
    nextStage,
    acceptOrder,
    rejectOrder,
  };
}