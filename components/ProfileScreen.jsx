import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import Profile from "./Profile";
import { formatMoney } from "../utils/helpers";

function ProfileScreen({
  rating,
  completedOrders,
  online,
  profileData,
  setProfileData,
  setShowEditModal,
  handleLogout,
  stats,
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.profileContent}
    >
      <Profile
        rating={rating}
        completed={completedOrders}
        online={online}
        profileData={profileData}
        setProfileData={setProfileData}
        setShowEditModal={setShowEditModal}
        handleLogout={handleLogout}
      />

      <View style={styles.statsGrid}>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            Total Deliveries
          </Text>

          <Text style={styles.statValue}>
            {stats.totalDeliveries}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            Total Earnings
          </Text>

          <Text style={styles.statValue}>
            {formatMoney(stats.totalEarnings)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            Average Fee
          </Text>

          <Text style={styles.statValue}>
            {formatMoney(stats.averageFee)}
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContent: {
    paddingBottom: 40,
  },

  statsGrid: {
    marginTop: 20,
    gap: 15,
  },

  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  statTitle: {
    color: "#6b7280",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
});

export default ProfileScreen;