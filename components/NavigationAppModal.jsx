import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";

function NavigationAppModal({
  visible,
  onClose,
  destination,
}) {
  const encodedDestination = encodeURIComponent(destination);

  const openGoogleMaps = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`
    );
    onClose();
  };

  const openWaze = () => {
    Linking.openURL(
      `https://waze.com/ul?q=${encodedDestination}&navigate=yes`
    );
    onClose();
  };

  const openAppleMaps = () => {
    Linking.openURL(
      `http://maps.apple.com/?daddr=${encodedDestination}`
    );
    onClose();
  };

  const openHereWeGo = () => {
    Linking.openURL(
      `https://share.here.com/l/${encodedDestination}`
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>
            Navigation App
          </Text>

          <TouchableOpacity
            style={styles.item}
            onPress={openGoogleMaps}
          >
            <Text style={styles.text}>
              🗺 Google Maps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={openWaze}
          >
            <Text style={styles.text}>
              🚗 Waze
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.item}
              onPress={openAppleMaps}
            >
              <Text style={styles.text}>
                🍎 Apple Maps
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.item}
            onPress={openHereWeGo}
          >
            <Text style={styles.text}>
              📍 HERE WeGo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancel}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.45)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  item: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  text: {
    fontSize: 20,
  },

  cancel: {
    marginTop: 25,
    alignItems: "center",
  },

  cancelText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 18,
  },
});

export default NavigationAppModal;