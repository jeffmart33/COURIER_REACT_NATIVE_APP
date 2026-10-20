import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import courierLogo from "../assets/images/courierlog.png";

function Sidebar({
  activeTab,
  setActiveTab,
  incomingOrders,
  handleLogout,
  online,
}) {
  return (
    <View style={styles.sidebar}>

      <View style={styles.logoContainer}>
        <Image
          source={courierLogo}
          style={styles.logo}
        />

        <Text style={styles.logoText}>
          Courier
        </Text>
      </View>

      <ScrollView
        style={styles.menu}
        showsVerticalScrollIndicator={false}
      >
        {[
          "Home",
          "Requests",
          "Orders",
          "Wallet",
          "History",
          "Profile",
          "Referral",
          "Campaigns",
        ].map((tab) => (

          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.menuItem,
              activeTab === tab &&
                styles.activeMenuItem,
            ]}
          >

            <View style={styles.menuIconContainer}>

              <Text style={styles.menuIcon}>
                {tab === "Home" && "🏠"}
                {tab === "Requests" && "🔔"}
                {tab === "Orders" && "📦"}
                {tab === "Wallet" && "💰"}
                {tab === "History" && "📜"}
                {tab === "Profile" && "👤"}
                {tab === "Referral" && "🎁"}
                {tab === "Campaigns" && "🏆"}
              </Text>

              {tab === "Requests" &&
                incomingOrders.length > 0 && (

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {incomingOrders.length}
                  </Text>
                </View>

              )}

            </View>

            <Text
              style={[
                styles.menuText,
                activeTab === tab &&
                  styles.activeMenuText,
              ]}
            >
              {tab}
            </Text>

          </TouchableOpacity>

        ))}
      </ScrollView>

      <View style={styles.sidebarFooter}>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            🔒 Logout
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.onlineStatus,
            {
              color: online
                ? "#22c55e"
                : "#ffffff",
            },
          ]}
        >
          ● {online ? "ONLINE" : "OFFLINE"}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: "#f97316",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },

  logoContainer: {
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  logoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  menu: {
    flex: 1,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
  },

  activeMenuItem: {
    backgroundColor: "#ea580c",
  },

  menuIconContainer: {
    position: "relative",
    marginRight: 12,
  },

  menuIcon: {
    fontSize: 22,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
  },

  menuText: {
    color: "#fff",
    fontSize: 16,
  },

  activeMenuText: {
    fontWeight: "700",
  },

  sidebarFooter: {
    padding: 20,
  },

  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },

  onlineStatus: {
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
  },
});

export default Sidebar;