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

export default function CourierResetCode() {
  const { email } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (code.length !== 4) {
        setError("Please enter the 4-digit code");
        return;
      }

      setLoading(true);

      const response = await API.post(
        "/api/auth/verify-reset-code",
        {
          email,
          code,
        }
      );

      Alert.alert(
        "Success",
        response.data.message
      );

      router.push({
        pathname: "/couriernewpassword",
        params: { email },
      });

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
            🔢
          </Text>

          <Text style={styles.title}>
            Enter Reset Code
          </Text>

          <Text style={styles.subtitle}>
            Enter the 4-digit reset code sent to your email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="••••"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={4}
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/\D/g, ""));
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
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading
                ? "Verifying..."
                : "Verify Code"}
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
});