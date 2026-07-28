import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";

import API from "../services/api";

import logo from "../assets/images/courierlog.png";

export default function CourierForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
  if (!email.trim()) {
    Alert.alert(
      "Missing Email",
      "Please enter your email address."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await API.post(
      "/api/auth/forgot-password",
      {
        email,
      }
    );

    Alert.alert(
      "Success",
      response.data.message
    );

    router.push({
      pathname: "/courierresetcode",
      params: {
        email,
      },
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
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <View style={styles.container}>

      <Image
        source={logo}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Forgot Password
      </Text>

      <Text style={styles.subtitle}>
        Enter your email and we'll send you a reset code
      </Text>

      <Text style={styles.label}>
        Your Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="rider@example.com"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Sending..."
            : "Send Reset Code"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.backText}>
          ← Back to Sign In
        </Text>
      </TouchableOpacity>

    </View>
  </KeyboardAvoidingView>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    justifyContent: "center",
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
    marginBottom: 35,
    lineHeight: 24,
  },

  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#111827",
  },

  button: {
    backgroundColor: "#c2410c",
    paddingVertical: 17,
    borderRadius: 14,
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },

  backContainer: {
    alignItems: "center",
    marginTop: 25,
  },

  backText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});