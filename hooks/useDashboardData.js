import { useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function useDashboardData({
  setDeliveryHistory,
  setWeeklyEarnings,
  setStats,
  setIncomingOrders,
  setWallet,
  setBankAccount,
  setTransactions,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
}) {

  const loadDashboardData = useCallback(async () => {

    try {

      const token =
        await AsyncStorage.getItem("courierToken");

      const [
        historyRes,
        weeklyRes,
        statsRes,
        pendingRes,
        walletRes,
        activeOrderRes,
      ] = await Promise.all([

        API.get("/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        API.get("/api/orders/weekly-earnings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        API.get("/api/orders/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        API.get("/api/orders/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        API.get("/api/wallet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        API.get("/api/orders/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

      ]);

      setDeliveryHistory(historyRes.data);

      setWeeklyEarnings(weeklyRes.data);

      setStats(statsRes.data);

      setIncomingOrders(pendingRes.data);

      setWallet(walletRes.data.wallet);

      setBankAccount(
        walletRes.data.bankAccount || {
          bankName: "",
          accountName: "",
          accountNumber: "",
        }
      );

      setTransactions(
        walletRes.data.transactions || []
      );

      if (
        activeOrderRes.data &&
        activeOrderRes.data._id
      ) {

        const stageMap = {
          accepted: "Assigned",
          heading_to_restaurant: "Heading to Restaurant",
          arrived_restaurant: "Arrived at Restaurant",
          picked_up: "Picked Up",
          on_the_way: "Arrived at Customer Address",
          delivered: "Delivered",
        };

        setActiveOrder(activeOrderRes.data);

        setOrderStage(
          stageMap[activeOrderRes.data.status] ||
            "Assigned"
        );

        setActiveTab("Orders");

      }

    } catch (error) {

      console.log(
        "Dashboard load failed",
        error
      );

    }

  }, [
    setDeliveryHistory,
    setWeeklyEarnings,
    setStats,
    setIncomingOrders,
    setWallet,
    setBankAccount,
    setTransactions,
    setActiveOrder,
    setOrderStage,
    setActiveTab,
  ]);

  useEffect(() => {

    loadDashboardData();

  }, [loadDashboardData]);

  return {
    loadDashboardData,
  };

}