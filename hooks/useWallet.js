import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function useWallet({
  setWallet,
  setBankAccount,
  setTransactions,
}) {
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = await AsyncStorage.getItem("courierToken");

        const { data } = await API.get(
          "/api/wallet",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWallet(data.wallet);

        setBankAccount(
          data.bankAccount || {
            bankName: "",
            accountName: "",
            accountNumber: "",
          }
        );

        setTransactions(
          data.transactions || []
        );

      } catch (error) {
        console.log(
          "Wallet fetch failed",
          error
        );
      }
    };

    fetchWallet();
  }, []);
}