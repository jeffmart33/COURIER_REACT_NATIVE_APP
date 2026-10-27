import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";

const PRIVACY_URL = "https://hooksfoodapp.com/privacy-policy";

import courierLogo from "../assets/images/courierlog.png";

function Profile({
  rating,
  completed,
  online,
  profileData,
  setShowEditModal,
  handleLogout,
}) {

  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);

    try {
      const token = await AsyncStorage.getItem("courierToken");

      await API.delete("/api/profile/account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Account deleted", "Your courier account and personal details have been deleted.");

      await handleLogout();
    } catch (error) {
      Alert.alert("Could not delete the account", error?.response?.data?.message || "Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(
      "Delete your account?",
      "Your name, contacts, bank details and ID photos will be deleted and you will be logged out. Past deliveries stay in Hooks records. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteAccount },
      ]
    );

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

      <TouchableOpacity
        accessibilityRole="link"
        style={styles.linkButton}
        onPress={() => Linking.openURL(PRIVACY_URL)}
      >
        <Text style={styles.linkText}>
          Privacy policy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        disabled={deleting}
        style={styles.deleteButton}
        onPress={confirmDelete}
      >
        <Text style={styles.deleteText}>
          {deleting ? "Deleting..." : "Delete my account"}
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

  linkButton: {
    paddingVertical: 14,
    marginTop: 8,
  },

  linkText: {
    color: "#F97316",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DC2626",
    marginBottom: 8,
  },

  deleteText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

});

export default Profile;