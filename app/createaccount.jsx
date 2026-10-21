import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

import API from "../services/api";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/images/courierlog.png";

export default function CourierCreateAccount() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [governmentIdType, setGovernmentIdType] = useState("");

  const [governmentIdFront, setGovernmentIdFront] = useState(null);
  const [governmentIdBack, setGovernmentIdBack] = useState(null);
  const [vehiclePhoto, setVehiclePhoto] = useState(null);

  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const vehicleData = [
    { label: "Motorbike", value: "bike" },
    { label: "Bicycle", value: "bicycle" },
    { label: "Car", value: "car" },
    { label: "Van", value: "van" },
  ];

  const governmentIdData = [
    { label: "NIN", value: "nin" },
    { label: "National ID Card", value: "national-id" },
    { label: "Valid Passport", value: "passport" },
    { label: "Voter's Card", value: "voters" },
  ];

  const pickGovernmentFront = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setGovernmentIdFront(result.assets[0]);
    }
  };

  const pickGovernmentBack = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setGovernmentIdBack(result.assets[0]);
    }
  };

  const pickVehiclePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setVehiclePhoto(result.assets[0]);
    }
  };
  const handleCreateAccount = async () => {
  try {
    if (
      !fullName ||
      !email ||
      !phone ||
      !city ||
      !homeAddress ||
      !vehicle ||
      !vehicleRegistration ||
      !governmentIdType ||
      !governmentIdFront ||
      !governmentIdBack ||
      !vehiclePhoto ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Error",
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("homeAddress", homeAddress);
    formData.append("vehicle", vehicle);
    formData.append(
      "vehicleRegistration",
      vehicleRegistration
    );
    formData.append(
      "governmentIdType",
      governmentIdType
    );
    formData.append("password", password);

    formData.append("governmentIdFront", {
      uri: governmentIdFront.uri,
      name: "governmentFront.jpg",
      type: "image/jpeg",
    });

    formData.append("governmentIdBack", {
      uri: governmentIdBack.uri,
      name: "governmentBack.jpg",
      type: "image/jpeg",
    });

    formData.append("vehiclePhoto", {
      uri: vehiclePhoto.uri,
      name: "vehicle.jpg",
      type: "image/jpeg",
    });

    await API.post(
      "/api/auth/register",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    Alert.alert(
      "Success",
      "Account created successfully. Please check your email for the verification code."
    );

    router.push({
      pathname: "/courierconfirmcode",
      params: { email },
    });
  } catch (error) {
    Alert.alert(
      "Error",
      error.response?.data?.message ||
        "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};
return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
  >
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={logo}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Join as a Courier
      </Text>

      <Text style={styles.subtitle}>
        Create your rider account to start delivering
      </Text>

     

      <Text style={styles.label}>
        Full Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="rider@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>
        Phone Number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="+234 801 234 5678"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>
        City
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Lagos"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>
        Home Address
      </Text>

      <TextInput
        style={styles.input}
        placeholder="12 Allen Avenue"
        value={homeAddress}
        onChangeText={setHomeAddress}
      />

      <Text style={styles.label}>
        Vehicle Type
      </Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownText}
        data={vehicleData}
        labelField="label"
        valueField="value"
        placeholder="Select Vehicle"
        value={vehicle}
        onChange={item => setVehicle(item.value)}
      />

      <Text style={styles.label}>
        Vehicle Registration Number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ABC-123XY"
        value={vehicleRegistration}
        onChangeText={setVehicleRegistration}
      />

      <Text style={styles.label}>
        Government ID Type
      </Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownText}
        data={governmentIdData}
        labelField="label"
        valueField="value"
        placeholder="Choose Government ID"
        value={governmentIdType}
        onChange={item => setGovernmentIdType(item.value)}
      />
            <Text style={styles.label}>
        Upload Front of ID
      </Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickGovernmentFront}
      >
        <Text style={styles.uploadText}>
          {governmentIdFront
            ? "Front ID Selected ✅"
            : "Choose Front Image"}
        </Text>
      </TouchableOpacity>

      {governmentIdFront && (
        <Image
          source={{ uri: governmentIdFront.uri }}
          style={styles.previewImage}
        />
      )}

      <Text style={styles.label}>
        Upload Back of ID
      </Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickGovernmentBack}
      >
        <Text style={styles.uploadText}>
          {governmentIdBack
            ? "Back ID Selected ✅"
            : "Choose Back Image"}
        </Text>
      </TouchableOpacity>

      {governmentIdBack && (
        <Image
          source={{ uri: governmentIdBack.uri }}
          style={styles.previewImage}
        />
      )}

      <Text style={styles.label}>
        Vehicle Photo
      </Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickVehiclePhoto}
      >
        <Text style={styles.uploadText}>
          {vehiclePhoto
            ? "Vehicle Photo Selected ✅"
            : "Choose Vehicle Photo"}
        </Text>
      </TouchableOpacity>

      {vehiclePhoto && (
        <Image
          source={{ uri: vehiclePhoto.uri }}
          style={styles.previewImage}
        />
      )}

      <Text style={styles.label}>
        Password
      </Text>

      <PasswordInput
        style={styles.input}
        placeholder="Minimum 8 characters"
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>
        Confirm Password
      </Text>

      <PasswordInput
        style={styles.input}
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.createButton}
        disabled={loading}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createButtonText}>
          {loading
            ? "Creating Account..."
            : "Create Courier Account"}
        </Text>
      </TouchableOpacity>

       <TouchableOpacity
  onPress={() => router.back()}
  style={{ alignItems: "center" }}
>
  <Text style={styles.backButton}>
    ← Back to Sign In
  </Text>
</TouchableOpacity>

    </ScrollView>
  </KeyboardAvoidingView>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f97316",
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 50,
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 24,
  },

  backButton: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 15,
  textAlign: "center",
  marginBottom: 25,
},

  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#111827",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 5,
  },

  dropdownPlaceholder: {
    color: "#9ca3af",
    fontSize: 16,
  },

  dropdownText: {
    color: "#111827",
    fontSize: 16,
  },

  uploadButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  uploadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 12,
    resizeMode: "cover",
  },

  createButton: {
    backgroundColor: "#c2410c",
    paddingVertical: 17,
    borderRadius: 14,
    marginTop: 30,
    marginBottom: 30,
  },

  createButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
});