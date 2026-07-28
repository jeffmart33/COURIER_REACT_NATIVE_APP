import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

function BottomNavigation({
  activeTab,
  setActiveTab,
  incomingOrders,
  setShowMoreMenu,
}) {
  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={() => {
  console.log("HOME BUTTON PRESSED");
  setActiveTab("Home");
}}
      >
        <Text style={styles.icon}>🏠</Text>
      </TouchableOpacity>

<TouchableOpacity
  onPress={() => setActiveTab("Requests")}
>
  <View style={styles.notificationContainer}>
    <Text style={styles.icon}>🔔</Text>

    {incomingOrders.length > 0 && (
      <Text style={styles.notificationCount}>
        {incomingOrders.length}
      </Text>
    )}
  </View>
</TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab("Orders")}
      >
        <Text style={styles.icon}>📦</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
  console.log("WALLET BUTTON PRESSED");
  setActiveTab("Wallet");
}}
      >
        <Text style={styles.icon}>💰</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowMoreMenu(true)}
      >
        <Text style={styles.icon}>☰</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,

  height: 70,

  backgroundColor: "#f97316",

  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",

  borderTopWidth: 1,
  borderTopColor: "#e5e7eb",

  elevation: 10,
  zIndex: 999,
},

  icon: {
    color: "#fff",
    fontSize: 24,
  },
notificationContainer: {
  flexDirection: "row",
  alignItems: "flex-start",
},

notificationCount: {
  color: "white",
  fontSize: 17,
  fontWeight: "bold",
  marginLeft: 1,
  marginTop: -4,
},

});

export default BottomNavigation;