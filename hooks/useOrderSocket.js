import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import socket, { connectSocket } from "../services/socket";
import { alertNewOrder } from "../services/notifications";

const sameId = (a, b) => String(a) === String(b);

export default function useOrderSocket({
  online,
  activeOrder,
  setIncomingOrders,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
}) {
  const activeOrderRef = useRef(activeOrder);
  const alertedRef = useRef(new Set());

  useEffect(() => {
    activeOrderRef.current = activeOrder;
  }, [activeOrder]);

  /* ================= CONNECT AND REGISTER ================= */

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

    connectSocket();

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
      if (!online && !order?.offer?.assignmentId) return;

      const key = String(order?._id);

      if (!alertedRef.current.has(key)) {
        alertedRef.current.add(key);
        alertNewOrder(order).catch(() => null);
      }

      setIncomingOrders((prev) => {
        const exists = prev.some(
          (o) => sameId(o._id, order._id)
        );

        if (exists) {
          return prev.map((o) =>
            sameId(o._id, order._id) ? order : o
          );
        }

        return [order, ...prev];
      });
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [online]);

  /* ================= OFFER GONE ================= */

  useEffect(() => {
    const removeOffer = (data) => {
      const orderId =
        typeof data === "object" && data !== null
          ? data.orderId
          : data;

      setIncomingOrders((prev) =>
        prev.filter(
          (o) => !sameId(o._id, orderId)
        )
      );
    };

    socket.on("order-accepted", removeOffer);
    socket.on("offer-withdrawn", removeOffer);
    socket.on("offer-expired", removeOffer);

    return () => {
      socket.off("order-accepted", removeOffer);
      socket.off("offer-withdrawn", removeOffer);
      socket.off("offer-expired", removeOffer);
    };
  }, []);

  /* ================= ORDER CANCELLED OR CHANGED ================= */

  useEffect(() => {
    const handleCancelled = (data) => {
      const orderId = data?.orderId;

      setIncomingOrders((prev) =>
        prev.filter(
          (o) => !sameId(o._id, orderId)
        )
      );

      const current = activeOrderRef.current;

      if (!current || (orderId && !sameId(current._id, orderId))) {
        return;
      }

      const reassigned = data?.reason === "reassigned";

      Alert.alert(
        reassigned
          ? "Delivery Reassigned"
          : "Order Cancelled",
        reassigned
          ? "This delivery was moved to another courier."
          : `This delivery was cancelled.${data?.reason ? ` Reason: ${data.reason}` : ""}`
      );

      setActiveOrder(null);
      setOrderStage("Assigned");
      setActiveTab("Home");
    };

    const handleUpdated = (order) => {
      setActiveOrder((current) =>
        current && sameId(current._id, order?._id)
          ? order
          : current
      );
    };

    socket.on("order-cancelled", handleCancelled);
    socket.on("delivery-updated", handleUpdated);

    return () => {
      socket.off("order-cancelled", handleCancelled);
      socket.off("delivery-updated", handleUpdated);
    };
  }, []);
}
