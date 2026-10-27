import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const VERSION_URL = "https://api.hooksfoodapp.com/app/version?app=courier";
const DISMISSED_KEY = "courier_update_dismissed";

const newerThan = (a, b) => {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  }

  return false;
};

function UpdateNotice() {
  const [info, setInfo] = useState(null);
  const [mode, setMode] = useState("none");
  const current = Constants.expoConfig?.version || "";

  useEffect(() => {
    if (!current) return;

    fetch(VERSION_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then(async (v) => {
        if (!v) return;

        setInfo(v);

        if (v.min_version && newerThan(v.min_version, current)) {
          setMode("required");
          return;
        }

        if (v.latest_version && newerThan(v.latest_version, current)) {
          const dismissed = await AsyncStorage.getItem(DISMISSED_KEY).catch(() => null);

          if (dismissed !== v.latest_version) setMode("optional");
        }
      })
      .catch(() => {});
  }, [current]);

  if (mode === "none" || !info) return null;

  const storeUrl = Platform.OS === "ios" ? info.ios_url : info.android_url;

  const later = () => {
    AsyncStorage.setItem(DISMISSED_KEY, info.latest_version).catch(() => {});
    setMode("none");
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={mode === "required" ? () => {} : later}>
      <View style={styles.overlay}>
        <View style={styles.container} testID="update-notice">
          <Text style={styles.title}>
            {mode === "required" ? "Please update Hooks Delivery Partner" : "A new version of Hooks Delivery Partner is ready"}
          </Text>

          <Text style={styles.text}>
            {info.message ||
              (mode === "required"
                ? "This version is too old to keep working. Update to keep receiving deliveries."
                : "Update to get the newest features and fixes.")}
          </Text>

          <Text style={styles.version}>
            Your version {current} · New version {info.latest_version || info.min_version}
          </Text>

          {!!storeUrl && (
            <TouchableOpacity accessibilityRole="button" style={styles.update} onPress={() => Linking.openURL(storeUrl)}>
              <Text style={styles.updateText}>Update now</Text>
            </TouchableOpacity>
          )}

          {mode === "optional" && (
            <TouchableOpacity accessibilityRole="button" style={styles.later} onPress={later}>
              <Text style={styles.laterText}>Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  container: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  text: {
    fontSize: 15,
    lineHeight: 21,
    color: "#4B5563",
    marginTop: 8,
  },

  version: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
  },

  update: {
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },

  updateText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  later: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },

  laterText: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default UpdateNotice;
