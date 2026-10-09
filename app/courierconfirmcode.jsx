import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import API from "../services/api";

export default function CourierConfirmCode() {
  const { email } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [sending, setSending] = useState(false);

  const [timer, setTimer] = useState(60);
  useEffect(() => {
  if (timer <= 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);

const handleResend = async () => {
  try {
    setSending(true);

    await API.post(
      "/api/auth/resend-verification",
      {
        email,
      }
    );

    Alert.alert(
      "Success",
      "New verification code sent."
    );

    setTimer(60);
  } catch (error) {
    Alert.alert(
      "Error",
      error.response?.data?.message ||
        "Failed to resend code."
    );
  } finally {
    setSending(false);
  }
};

const handleVerify = async () => {
  try {
    if (code.length !== 4) {
      setError(
        "Please enter the 4-digit code"
      );
      return;
    }

    setLoading(true);

    const response = await API.post(
      "/api/auth/verify",
      {
        email,
        code,
      }
    );

    await AsyncStorage.setItem(
      "courierToken",
      response.data.token
    );

    await AsyncStorage.setItem(
      "courierUser",
      JSON.stringify(
        response.data.courier
      )
    );

    await AsyncStorage.setItem(
      "courierId",
      String(response.data.courier?.id || "")
    );

    Alert.alert(
      "Success",
      response.data.message
    );

    router.replace("/courierdashboard");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Verification failed"
    );
  } finally {
    setLoading(false);
  }
};
return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={
      Platform.OS === "ios"
        ? "padding"
        : undefined
    }
  >
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.icon}>
          🔐
        </Text>

        <Text style={styles.title}>
          Confirm Your Account
        </Text>

        <Text style={styles.subtitle}>
          Enter the 4-digit verification code sent to your email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="••••"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={4}
          value={code}
          onChangeText={(text) => {
            setCode(
              text.replace(/\D/g, "")
            );
            setError("");
          }}
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading
              ? "Verifying..."
              : "Verify Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          disabled={
            timer > 0 || sending
          }
        >
          <Text style={styles.resendText}>
            {timer > 0
              ? `Resend Code (${timer}s)`
              : sending
              ? "Sending..."
              : "Resend Verification Code"}
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fb923c",
    borderRadius: 20,
    padding: 25,
  },

  icon: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    fontSize: 24,
    letterSpacing: 12,
    textAlign: "center",
    color: "#111827",
  },

  error: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },

  verifyButton: {
    backgroundColor: "#c2410c",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 25,
  },

  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },

  resendText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});