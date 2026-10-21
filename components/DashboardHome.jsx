import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatMoney } from "../utils/helpers";

import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";

import API from "../services/api";

import CourierMap from "./CourierMap";
import EarningsChart from "./EarningsChart";


function DashboardHome({
      online,
  setOnline,
  wallet,
  rating,
  completedOrders,
  profileData,
  location,
  setLocation,
  router,
 incomingOrders,
  weeklyEarnings,
  setOnlineLoading,
  onlineLoading,
    loadDashboardData,
      activeOrder,
        orderStage,
}) {
  

  const displayWallet = wallet;

  const handleToggleOnline = async () => {
    if (onlineLoading) return;

    try {
      setOnlineLoading(true);

      const token =
        await AsyncStorage.getItem("courierToken");

      const newStatus = !online;

      /*
       * ==============================
       * GOING ONLINE
       * ==============================
       */

      if (newStatus) {

        // ==============================
        // LOCATION PERMISSION
        // ==============================

        const {
          status: locationStatus,
        } =
          await Location.requestForegroundPermissionsAsync();

        if (locationStatus !== "granted") {

          Alert.alert(
            "Location Permission Required",
            "HOOKS FOOD needs your location to show your position on the delivery map and send you delivery requests.",
            [
              {
                text: "OK",
              },
            ]
          );

          return;
        }


        // ==============================
        // NOTIFICATION PERMISSION
        // ==============================

        const {
          status: notificationStatus,
        } =
          await Notifications.requestPermissionsAsync();

        if (notificationStatus !== "granted") {

          Alert.alert(
            "Notification Permission Required",
            "Please allow notifications so you can receive new delivery requests and important order updates."
          );

          return;
        }


        // ==============================
        // GET CURRENT LOCATION
        // ==============================

        const current =
          await Location.getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.High,
          });

        const lat =
          current.coords.latitude;

        const lng =
          current.coords.longitude;


        // ==============================
        // UPDATE LOCAL LOCATION
        // ==============================

        setLocation({
          lat,
          lng,
          speed:
            current.coords.speed || 0,
          accuracy:
            current.coords.accuracy || 0,
          heading:
            current.coords.heading || 0,
        });


        // ==============================
        // SAVE LOCATION TO BACKEND
        // ==============================

        await API.put(
          "/api/profile/location",
          {
            lat,
            lng,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      }


      // ==============================
      // UPDATE ONLINE STATUS
      // ==============================

      await API.put(
        "/api/profile/online",
        {
          online: newStatus,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      // ==============================
      // UPDATE UI
      // ==============================

      setOnline(newStatus);


    } catch (err) {

      console.log(
        "Go Online Error:",
        err?.response?.data || err
      );

      Alert.alert(
        "Unable to Go Online",
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );

    } finally {

      setOnlineLoading(false);

    }
  };


  return (
  <ScrollView
  contentContainerStyle={{
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // leaves space above bottom navigation
  }}
  showsVerticalScrollIndicator={false}
>

    {/* ================= HEADER ================= */}

<View style={styles.header}>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <View>
      <Text style={styles.title}>
        Welcome back 👋
      </Text>

      <Text style={styles.subtitle}>
        Ready for your next delivery today.
      </Text>
    </View>

    <TouchableOpacity
      style={styles.refreshButton}
      onPress={loadDashboardData}
    >
      <MaterialIcons
        name="refresh"
        size={28}
        color="#f97316"
      />
    </TouchableOpacity>

  </View>

  <TouchableOpacity
    disabled={onlineLoading}
    style={[
      styles.onlineButton,
      online
        ? styles.offlineButton
        : styles.goOnlineButton,
      onlineLoading && styles.disabledButton,
    ]}
    onPress={handleToggleOnline}
  >
    <Text style={styles.buttonText}>
      {onlineLoading
        ? "Please wait..."
        : online
          ? "Go Offline"
          : "Go Online"}
    </Text>
  </TouchableOpacity>

</View>


    {/* ================= TOP CARDS ================= */}

<View style={styles.cardsContainer}>

  {/* STATUS */}

  <View style={styles.card}>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}
>

<View>
    <Text style={styles.cardLabel}>
      Status
    </Text>

    <Text style={styles.cardValue}>
      {online ? "ONLINE" : "OFFLINE"}
    </Text>

    <Text
      style={[
        styles.cardStatus,
        {
          color: online
            ? "#16a34a"
            : "#dc2626",
        },
      ]}
    >
      {online
        ? "🟢 Receiving Orders"
        : "🔴 Not Receiving Orders"}
    </Text>
    </View>

    <Text style={styles.cardIcon}>
      🚦
    </Text>
    </View>

  </View>

  {/* TODAY */}

  <View style={styles.card}>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}
>

<View>

    <Text style={styles.cardLabel}>
      Today's Earnings
    </Text>

    <Text style={styles.cardValue}>
      {formatMoney(displayWallet.today)}
    </Text>

    <Text style={styles.greenText}>
      💰 Earnings Today
    </Text>
    </View>

    <Text style={styles.cardIcon}>
      💰
    </Text>
</View>
  </View>

  {/* WALLET */}

<View style={styles.card}>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}
>

<View>
    <Text style={styles.cardLabel}>
      Wallet Balance
    </Text>

    <Text style={styles.cardValue}>
      {formatMoney(displayWallet.available)}
    </Text>

    <Text style={styles.blueText}>
      💳 Available Balance
    </Text>
    </View>

    <Text style={styles.cardIcon}>
      👛
    </Text>
    </View>

  </View>

  {/* RATING */}

<View style={styles.card}>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}
>

<View>
    <Text style={styles.cardLabel}>
      Deliveries
    </Text>

    <Text style={styles.cardValue}>
      {completedOrders || 0}
    </Text>

    <Text style={styles.orangeText}>
      📦 Completed
    </Text>
    </View>

    <Text style={styles.cardIcon}>
      📦
    </Text>
    </View>

  </View>

  {/* SURGE */}

<View style={styles.card}>

<View
style={{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}}
>

<View>
    <Text style={styles.cardLabel}>
      This Week
    </Text>

    <Text style={styles.cardValue}>
      {formatMoney(displayWallet.weekly)}
    </Text>

    <Text style={styles.purpleText}>
      📅 Earned since Monday
    </Text>
    </View>

    <Text style={styles.cardIcon}>
      📅
    </Text>
    </View>

  </View>

</View>

    {/* ================= MAP + OVERVIEW ================= */}

<View style={styles.mapSection}>

  {/* LEFT SIDE */}

  <View style={styles.mapContainer}>

    <View>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    }}
  >
    <Text style={styles.sectionTitle}>
      🗺️ Live Delivery Map
    </Text>

    {online && (
    <View
      style={{
        marginLeft: 10,
        backgroundColor: "#dcfce7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
      }}
    >
      <Text
        style={{
          color: "#15803d",
          fontWeight: "700",
          fontSize: 12,
        }}
      >
        🟢 LIVE
      </Text>
    </View>
    )}

  </View>

  <Text style={styles.sectionSubtitle}>
    Track your position and nearby deliveries in real time.
  </Text>

</View>


    {/* MAP STATS */}

    <View style={styles.mapStatsContainer}>

      <View style={styles.mapStatCard}>
        <Text style={styles.mapStatLabel}>📍 Latitude</Text>
        <Text style={styles.mapStatValue}>
          {typeof location?.lat === "number"
            ? location.lat.toFixed(4)
            : "--"}
        </Text>
      </View>

      <View style={styles.mapStatCard}>
        <Text style={styles.mapStatLabel}>📍 Longitude</Text>
        <Text style={styles.mapStatValue}>
          {typeof location?.lng === "number"
            ? location.lng.toFixed(4)
            : "--"}
        </Text>
      </View>

      <View style={styles.mapStatCard}>
        <Text style={styles.mapStatLabel}>
          📦 Pending Requests
        </Text>

        <Text style={styles.mapStatValue}>
          {incomingOrders.length}
        </Text>
      </View>

      <View style={styles.mapStatCard}>
        <Text style={styles.mapStatLabel}>
          💰 Today
        </Text>

        <Text style={styles.mapStatValue}>
          {formatMoney(displayWallet.today)}
        </Text>
      </View>

    </View>

    <View style={styles.mapWrapper}>

      <CourierMap
  location={location}
  online={online}
  router={router}
  activeOrder={activeOrder}
  orderStage={orderStage}
/>

    </View>

  </View>


  {/* RIGHT SIDE */}

  <View style={styles.performanceCard}>

    <Text style={styles.performanceTitle}>
      🚚 Courier Performance
    </Text>

    <Text style={styles.performanceSubtitle}>
      Live activity today
    </Text>


    <View style={styles.performanceStatus}>

      <Text>Current Status</Text>

      <Text
        style={{
          fontWeight: "700",
          color: online ? "#16a34a" : "#dc2626",
        }}
      >
        {online ? "🟢 ONLINE" : "🔴 OFFLINE"}
      </Text>

    </View>


    <View style={styles.performanceGrid}>

      <View style={styles.performanceItem}>
        <Text>💰 Earnings</Text>
        <Text style={styles.performanceValue}>
          {formatMoney(displayWallet.today)}
        </Text>
      </View>

      <View style={styles.performanceItem}>
        <Text>👛 Wallet</Text>
        <Text style={styles.performanceValue}>
          {formatMoney(displayWallet.available)}
        </Text>
      </View>

      <View style={styles.performanceItem}>
        <Text>📦 Deliveries</Text>
        <Text style={styles.performanceValue}>
          {completedOrders || 0}
        </Text>
      </View>

      <View style={styles.performanceItem}>
        <Text>📦 Pending</Text>
        <Text style={styles.performanceValue}>
          {incomingOrders.length}
        </Text>
      </View>

    </View>

  </View>

</View>


    {/* ================= PLACEHOLDERS ================= */}

<View style={styles.bottomSection}>

  {/* WEEKLY EARNINGS */}

  <View style={styles.bottomCard}>

    <View style={styles.bottomHeader}>

      <Text style={styles.bottomTitle}>
        📈 Weekly Earnings
      </Text>

      <Text style={styles.orangeLabel}>
        This Week
      </Text>

    </View>


    
    <EarningsChart
      data={weeklyEarnings}
    />

  </View>


  {/* WALLET BREAKDOWN */}

  <View style={styles.bottomCard}>

    <Text style={styles.bottomTitle}>
      💳 Wallet Breakdown
    </Text>

    <View style={styles.rowItem}>
      <Text>Available</Text>
      <Text style={styles.bold}>
        {formatMoney(displayWallet.available)}
      </Text>
    </View>

    <View style={styles.rowItem}>
      <Text>Pending</Text>
      <Text style={styles.bold}>
        {formatMoney(displayWallet.pending)}
      </Text>
    </View>

    <View style={styles.rowItem}>
      <Text>Today's Earnings</Text>
      <Text style={styles.bold}>
        {formatMoney(displayWallet.today)}
      </Text>
    </View>

    <View style={styles.rowDivider} />

    <View style={styles.rowItem}>
      <Text>Total Earned</Text>
      <Text
        style={[
          styles.bold,
          {
            color: "#16a34a",
          },
        ]}
      >
        {formatMoney(displayWallet.totalEarned)}
      </Text>
    </View>

  </View>


  {/* COURIER ACTIVITY */}

  <View style={styles.bottomCard}>

    <Text style={styles.bottomTitle}>
      📜 Courier Activity
    </Text>

    <View style={styles.rowItem}>
      <Text>Status</Text>
      <Text style={styles.bold}>
        {online ? "🟢 Online" : "🔴 Offline"}
      </Text>
    </View>

    <View style={styles.rowItem}>
      <Text>Pending Orders</Text>
      <Text style={styles.bold}>
        {incomingOrders.length}
      </Text>
    </View>

    <View style={styles.rowItem}>
      <Text>Deliveries</Text>
      <Text style={styles.bold}>
        {completedOrders || 0}
      </Text>
    </View>

    <View style={styles.rowItem}>
      <Text>This Week</Text>
      <Text style={styles.bold}>
        {formatMoney(displayWallet.weekly)}
      </Text>
    </View>

    <View style={styles.rowDivider} />

    <View style={styles.rowItem}>
      <Text>Wallet</Text>
      <Text style={styles.bold}>
        {formatMoney(displayWallet.available)}
      </Text>
    </View>

  </View>

</View>
  </ScrollView>
);
}


const styles = StyleSheet.create({

    container: {
  flex: 1,
  backgroundColor: "#f5f5f5",
},

content: {
  padding: 18,
  paddingBottom: 40,
},

header: {
  marginBottom: 25,
},

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },

  onlineButton: {
  width: 220,
  height: 56,
  alignSelf: "flex-start",
  marginTop: 20,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",

  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 5,
},
  goOnlineButton: {
    backgroundColor: "#16a34a",
  },

  offlineButton: {
    backgroundColor: "#dc2626",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  cardsContainer: {
  marginBottom: 25,
},

card: {
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  marginBottom: 18,
  elevation: 3,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 3,
  },
},

cardLabel: {
  fontSize: 14,
  color: "#777",
},

cardValue: {
  fontSize: 24,
  fontWeight: "700",
  marginTop: 8,
},

cardStatus: {
  marginTop: 6,
  fontSize: 13,
},

greenText: {
  color: "#16a34a",
  marginTop: 6,
},

blueText: {
  color: "#2563eb",
  marginTop: 6,
},

orangeText: {
  color: "#ea580c",
  marginTop: 6,
},

purpleText: {
  color: "#9333ea",
  marginTop: 6,
},

cardIcon: {
  fontSize: 36,
  marginTop: 16,
  alignSelf: "flex-end",
},

mapSection: {
  marginBottom: 20,
},

mapContainer: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 16,
  marginBottom: 20,
},

mapHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 18,
},

sectionTitle: {
  fontSize: 22,
  fontWeight: "700",
},

sectionSubtitle: {
  color: "#666",
  marginTop: 4,
},

liveBadge: {
  backgroundColor: "#dcfce7",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},

liveBadgeText: {
  color: "#15803d",
  fontWeight: "700",
},

mapStatsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 20,
},

mapStatCard: {
  width: "48%",
  backgroundColor: "#f8fafc",
  padding: 12,
  borderRadius: 14,
  marginBottom: 12,
},

mapStatLabel: {
  color: "#666",
},

mapStatValue: {
  marginTop: 6,
  fontWeight: "700",
  fontSize: 16,
},

mapWrapper: {
  height: 320,
  borderRadius: 20,
  overflow: "hidden",
},

performanceCard: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 18,
},

performanceTitle: {
  fontSize: 22,
  fontWeight: "700",
},

performanceSubtitle: {
  color: "#666",
  marginBottom: 16,
},

performanceStatus: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

performanceGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

performanceItem: {
  width: "48%",
  backgroundColor: "#f5f5f5",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
},

performanceValue: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 6,
},

bottomSection: {
  marginTop: 20,
},

bottomCard: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 18,
  marginBottom: 20,
},

bottomHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 18,
},

bottomTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 16,
},

orangeLabel: {
  color: "#f97316",
  fontWeight: "700",
},

rowItem: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 10,
},

rowDivider: {
  height: 1,
  backgroundColor: "#e5e7eb",
  marginVertical: 12,
},

bold: {
  fontWeight: "700",
},













refreshButton: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 5,
  shadowOffset: {
    width: 0,
    height: 2,
  },

  elevation: 4,
},

});
export default DashboardHome;
