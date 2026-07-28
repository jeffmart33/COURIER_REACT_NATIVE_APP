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
    if (!target) return false;

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
      "Arrived at Customer Address",
      "Delivered",
    ];

    const statusMap = {
      Assigned: "accepted",
      "Heading to Restaurant":
        "heading_to_restaurant",
      "Arrived at Restaurant":
        "arrived_restaurant",
      "Picked Up": "picked_up",
      "Arrived at Customer Address":
        "on_the_way",
      Delivered: "delivered",
    };

    const index = flow.indexOf(orderStage);

    if (index >= flow.length - 1) return;

    const next = flow[index + 1];

    setOrderStage(next);

    try {
      const token =
        await AsyncStorage.getItem(
          "courierToken"
        );

      await API.put(
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
    } catch (error) {
      console.log(
        "Status update failed",
        error
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