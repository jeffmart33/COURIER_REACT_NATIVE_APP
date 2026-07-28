import React, { useState } from "react";

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

import { router, useLocalSearchParams } from "expo-router";

import API from "../services/api";

export default function CourierNewPassword() {
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      if (password.length < 8) {
        setError(
          "Password must be at least 8 characters long."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      setLoading(true);

      const response = await API.post(
        "/api/auth/reset-password",
        {
          email,
          password,
        }
      );

      Alert.alert(
        "Success",
        response.data.message
      );

      router.replace("/login");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Reset failed"
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
            🔒
          </Text>

          <Text style={styles.title}>
            Set New Password
          </Text>

          <Text style={styles.subtitle}>
            Create a strong password to secure your account
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
          />

          <TextInput
            style={[
              styles.input,
              { marginTop: 15 },
            ]}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError("");
            }}
          />

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading
                ? "Updating..."
                : "Confirm & Continue"}
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#111827",
  },

  error: {
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#c2410c",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 25,
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
});