import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import courierLogo from "../assets/images/courierlog.png";

function Profile({
  rating,
  completed,
  online,
  profileData,
  setShowEditModal,
  handleLogout,
}) {

  const displayCompleted = completed || 0;

  const displayCity = profileData?.city || "--";

  const displayName = profileData?.fullName || "Courier";

  return (
    <View>

{/* ================= PROFILE CARD ================= */}

<View style={styles.profileCard}>

  <Image
    source={courierLogo}
    style={styles.avatar}
    resizeMode="contain"
  />

  <Text style={styles.name}>
    {displayName}
  </Text>

  <Text style={styles.city}>
    {displayCity}
  </Text>

  <View style={styles.badgesRow}>

    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        📦 {displayCompleted} Deliveries
      </Text>
    </View>

  </View>

  <View
    style={[
      styles.statusBadge,
      {
        backgroundColor: online
          ? "#16a34a"
          : "#dc2626",
      },
    ]}
  >
    <Text style={styles.statusText}>
      {online ? "ONLINE" : "OFFLINE"}
    </Text>
  </View>

</View>

      {/* Information */}

      <View style={styles.infoCard}>

<Text style={styles.label}>
📞 Phone Number
</Text>

<Text style={styles.value}>
{profileData?.phone || "Not Provided"}
</Text>

</View>

<View style={styles.infoCard}>

<Text style={styles.label}>
📧  Email Address
</Text>

<Text style={styles.value}>
{profileData?.email || "Not Provided"}
</Text>

</View>

<View style={styles.infoCard}>

<Text style={styles.label}>
🚗 Delivery Vehicle
</Text>

<Text style={styles.value}>
{profileData?.vehicle || "Not Provided"}
</Text>

</View>

      <View style={styles.infoCard}>

<Text style={styles.label}>
Vehicle Registration
</Text>

<Text style={styles.value}>
{profileData?.vehicleRegistration || "Not Provided"}
</Text>

</View>


      <View style={styles.infoCard}>

<Text style={styles.label}>
Government ID type
</Text>

<Text style={styles.value}>
{profileData?.governmentId || "Not Provided"}
</Text>

</View>


      <View style={styles.infoCard}>

<Text style={styles.label}>
Home Address
</Text>

<Text style={styles.value}>
{profileData?.address || "Not Provided"}
</Text>

</View>

<View style={styles.infoCard}>

<Text style={styles.label}>
Referral Code
</Text>

<Text style={[styles.value,{color:"#f97316"}]}>
{profileData?.referralCode || "Not Available"}
</Text>

</View>


      {/* Buttons */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setShowEditModal(true)}
      >
        <Text style={styles.buttonText}>
          ✏ Edit Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>
          🔒 Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  profileCard: {
    backgroundColor: "#3B4CE2",
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 52,
    marginBottom: 18,
    alignSelf: "flex-start",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },

  city: {
    color: "#E5E7EB",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 18,
  },

  badgesRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  badge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    marginRight: 10,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#16a34a",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  label: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
  },

  value: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },

  orange: {
    color: "#F97316",
    fontWeight: "600",
  },

  green: {
    color: "#16A34A",
    fontWeight: "600",
  },

  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

});

export default Profile;