import React from "react";

import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";

function EditProfileModal({
  visible,
  onClose,
  profileData,
  setProfileData,
}) {
  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("courierToken");

      await API.put(
        "/api/profile",
        {
          fullName: profileData.fullName,
          phone: profileData.phone,
          vehicle: profileData.vehicle,
          city: profileData.city,
          vehicleRegistration: profileData.vehicleRegistration,
          governmentIdType: profileData.governmentId,
          address: profileData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );

      onClose();

    } catch (error) {

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile."
      );

    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>
            Edit Profile
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            <Text style={styles.label}>
              Full Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#6B7280"
              value={profileData?.fullName || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  fullName: text,
                })
              }
            />

            <Text style={styles.label}>
              Vehicle
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your vehicle"
              placeholderTextColor="#6B7280"
              value={profileData?.vehicle || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  vehicle: text,
                })
              }
            />

            <Text style={styles.label}>
              Vehicle Registration
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Vehicle registration"
              placeholderTextColor="#6B7280"
              value={profileData?.vehicleRegistration || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  vehicleRegistration: text,
                })
              }
            />

            <Text style={styles.label}>
              Government ID type
            </Text>

            <TextInput
              style={styles.input}
              placeholder="For example NIN or Drivers licence"
              placeholderTextColor="#6B7280"
              value={profileData?.governmentId || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  governmentId: text,
                })
              }
            />

            <Text style={styles.label}>
              Home Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Home address"
              placeholderTextColor="#6B7280"
              value={profileData?.address || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  address: text,
                })
              }
            />

            <Text style={styles.label}>
              Phone Number
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              value={profileData?.phone || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  phone: text,
                })
              }
            />

            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={profileData?.email || ""}
              editable={false}
            />

            <Text style={styles.label}>
              City
            </Text>

            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#6B7280"
              value={profileData?.city || ""}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  city: text,
                })
              }
            />

            <View style={styles.buttonRow}>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveProfile}
              >
                <Text style={styles.saveText}>
                  Save Changes
                </Text>
              </TouchableOpacity>

            </View>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },

  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    maxHeight: "88%",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 6,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 14,
  },

  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 10,
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

});

export default EditProfileModal;