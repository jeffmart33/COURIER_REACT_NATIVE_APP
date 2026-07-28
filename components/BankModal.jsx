import React from "react";

import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";

function BankModal({
  visible,
  onClose,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  setBankAccount,
}) {

  const handleSave = async () => {

    if (
      !bankName ||
      !accountName ||
      !accountNumber
    ) {
      Alert.alert(
        "Please complete all fields."
      );
      return;
    }

    try {

      const token =
        await AsyncStorage.getItem(
          "courierToken"
        );

      await API.put(
        "/api/wallet/bank-account",
        {
          bankName,
          accountName,
          accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBankAccount({
        bankName,
        accountName,
        accountNumber,
      });

      onClose();

      Alert.alert(
        "Success",
        "Bank account updated."
      );

    } catch {

      Alert.alert(
        "Error",
        "Failed to save."
      );

    }

  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>
            Bank Account
          </Text>

<Text style={styles.label}>
  Bank Name
</Text>

<TextInput
  style={styles.input}
  placeholder="Enter bank name"
  placeholderTextColor="#9ca3af"
  value={bankName}
  onChangeText={(text) =>
    setBankName(
      text.replace(/[^A-Za-z\s]/g, "")
    )
  }
/>

<Text style={styles.label}>
  Account Name
</Text>

<TextInput
  style={styles.input}
  placeholder="Enter account name"
  placeholderTextColor="#9ca3af"
  value={accountName}
  onChangeText={(text) =>
    setAccountName(
      text.replace(/[^A-Za-z\s]/g, "")
    )
  }
/>

<Text style={styles.label}>
  Account Number
</Text>

<TextInput
  style={styles.input}
  placeholder="Enter account number"
  placeholderTextColor="#9ca3af"
  keyboardType="number-pad"
  maxLength={10}
  value={accountNumber}
  onChangeText={(text) =>
    setAccountNumber(
      text.replace(/\D/g, "")
    )
  }
/>
          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.cancel}
              onPress={onClose}
            >
<Text
  style={{
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  }}
>
  Cancel
</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.save}
              onPress={handleSave}
            >
<Text
  style={{
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  }}
>
  Save
</Text>
            </TouchableOpacity>

          </View>

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
    paddingHorizontal: 18,
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 26,
    paddingVertical: 28,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 28,
  },

  label: {
    fontSize: 17,
    color: "#1f2937",
    marginBottom: 10,
    fontWeight: "500",
  },

  input: {
    height: 66,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#111827",
    backgroundColor: "#fff",
    marginBottom: 24,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },

  cancel: {
    width: 125,
    height: 58,
    backgroundColor: "#D1D5DB",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  save: {
    width: 125,
    height: 58,
    backgroundColor: "#16A34A",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

});
export default BankModal;