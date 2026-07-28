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

function WithdrawModal({
  visible,
  wallet,
  bankAccount,
  withdrawAmount,
  setWithdrawAmount,
  setWallet,
  setShowWithdrawModal,
}) {
  const handleWithdraw = async () => {
    try {
      const token = await AsyncStorage.getItem("courierToken");

      const response = await API.post(
        "/api/wallet/withdraw",
        {
          amount: Number(withdrawAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
Alert.alert(
  "✅ Withdrawal Submitted",
  "💰 Your withdrawal request has been submitted successfully.\n\n⏳ Processing usually takes 1–3 working days.\n\n🏦 The funds will be sent to your registered bank account once approved."
);
      setWallet(response.data.wallet);
      setWithdrawAmount("");
      setShowWithdrawModal(false);

    } catch (error) {

      Alert.alert(
        "Error",
        error.response?.data?.message ||
        "Withdrawal failed"
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
            Withdraw Earnings
          </Text>

          <Text>
            Available: €{wallet.available}
          </Text>

          <Text>
            Bank: {bankAccount.bankName}
          </Text>

          <Text>
            Account Name: {bankAccount.accountName}
          </Text>

          <Text>
            Account Number: {bankAccount.accountNumber}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
          />

          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.cancel}
              onPress={() =>
                setShowWithdrawModal(false)
              }
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.withdraw}
              onPress={handleWithdraw}
            >
              <Text style={{ color: "#fff" }}>
                Withdraw
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
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },

  cancel: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  withdraw: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default WithdrawModal;