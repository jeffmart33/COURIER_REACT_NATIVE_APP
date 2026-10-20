import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

function MoreMenu({
  visible,
  onClose,
  setActiveTab,
  handleLogout,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>

        <View style={styles.container}>

          <View style={styles.header}>

  <Text style={styles.title}>
    More
  </Text>

  <TouchableOpacity onPress={onClose}>
    <Ionicons
      name="close"
      size={28}
      color="#111827"
    />
  </TouchableOpacity>

</View>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setActiveTab("History");
              onClose();
            }}
          >
            <Text>📜 History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setActiveTab("Profile");
              onClose();
            }}
          >
            <Text>👤 Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setActiveTab("Referral");
              onClose();
            }}
          >
            <Text>🎁 Referral</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setActiveTab("Campaigns");
              onClose();
            }}
          >
            <Text>🏆 Campaigns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              onClose();
              handleLogout();
            }}
          >
            <Text style={{ color: "#fff" }}>
              🚪 Logout
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,.4)",
  },

  container: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

  title: {
  fontSize: 22,
  fontWeight: "700",
},

  item: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginBottom: 10,
  },

  logout: {
    padding: 16,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
});

export default MoreMenu;