import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import socket from "../services/socket";

export default function useOrderSocket({
  online,
  setIncomingOrders,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
}) {
  /* ================= REGISTER COURIER ================= */

  useEffect(() => {
    const registerCourier = async () => {
      const courierId =
        await AsyncStorage.getItem("courierId");

      if (courierId) {
        socket.emit(
          "register-courier",
          courierId
        );
      }
    };

    if (socket.connected) {
      registerCourier();
    }

    socket.on("connect", registerCourier);

    return () => {
      socket.off("connect", registerCourier);
    };
  }, []);

  /* ================= NEW ORDER ================= */

  useEffect(() => {
    const handleNewOrder = (order) => {
      if (!online) return;

      setIncomingOrders((prev) => {
        const exists = prev.some(
          (o) => o._id === order._id
        );

        if (exists) return prev;

        return [order, ...prev];
      });
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [online]);

  /* ================= ORDER ACCEPTED ================= */

  useEffect(() => {
    const handleAccepted = (orderId) => {
      setIncomingOrders((prev) =>
        prev.filter(
          (o) => o._id !== orderId
        )
      );
    };

    socket.on(
      "order-accepted",
      handleAccepted
    );

    return () => {
      socket.off(
        "order-accepted",
        handleAccepted
      );
    };
  }, []);

  /* ================= ORDER CANCELLED ================= */

  useEffect(() => {
    const handleCancelled = () => {
      Alert.alert(
        "Order Cancelled",
        "This order has been cancelled by the customer."
      );

      setActiveOrder(null);
      setIncomingOrders([]);
      setOrderStage("Assigned");
      setActiveTab("Home");
    };

    socket.on(
      "order-cancelled",
      handleCancelled
    );

    return () => {
      socket.off(
        "order-cancelled",
        handleCancelled
      );
    };
  }, []);
}