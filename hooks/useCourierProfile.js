import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function useCourierProfile({
  setProfileData,
  setOnline,
  setRating,
  setCompletedOrders,
}) {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("courierToken");

        const { data } = await API.get(
          "/api/courier/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileData({
          ...data,
          governmentId: data.governmentIdType || "",
          address: data.homeAddress || "",
        });
        setOnline(data.online ?? false);
        setRating(data.rating ?? 0);
        setCompletedOrders(data.completedOrders ?? 0);

      } catch (error) {
        console.log(
          "Profile fetch failed",
          error
        );
      }
    };

    fetchProfile();
  }, []);
}