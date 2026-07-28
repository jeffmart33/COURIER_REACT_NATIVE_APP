import React from "react";

import {
  View,
 Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import WalletCard from "./WalletCard";
import BankModal from "./BankModal";

function Wallet({
  wallet,
  transactions,
  bankAccount,
  setBankAccount,
  setShowWithdrawModal,
  showBankModal,
  setShowBankModal,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
}) {
  return (
<ScrollView
  contentContainerStyle={{
    padding: 20,
    paddingBottom: 100,
  }}
  showsVerticalScrollIndicator={false}
>
      <Text style={styles.title}>
        Wallet & Earnings
      </Text>

      {/* Balance Cards */}

      <View style={styles.balanceRow}>

        <WalletCard
          title="Available Balance"
          amount={wallet?.available || 0}
          backgroundColor="#16a34a"
        />

        <WalletCard
          title="Pending Earnings"
          amount={wallet?.pending || 0}
          backgroundColor="#eab308"
        />

        <WalletCard
          title="Today's Earnings"
          amount={wallet?.today || 0}
          backgroundColor="#2563eb"
        />
        </View>


      {/* Withdraw */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Withdraw Earnings
        </Text>

        <Text style={styles.description}>
          Transfer your available balance directly to your bank account.
        </Text>

        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => setShowWithdrawModal(true)}
        >
          <Text style={styles.withdrawText}>
            Withdraw Funds
          </Text>
        </TouchableOpacity>

      </View>

      {/* Earnings Summary */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Earnings Summary
        </Text>

        <View style={styles.row}>
          <Text>This Week</Text>
          <Text>€{wallet?.weekly || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text>This Month</Text>
          <Text>€{wallet?.monthly || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text>Total Earned</Text>
          <Text>€{wallet?.totalEarned || 0}</Text>
        </View>

      </View>

      {/* Bank Account */}

      <View style={styles.card}>

<Text style={styles.sectionTitle}>
  Payment Account
</Text>

<Text style={styles.accountHeading}>
  Bank Account
</Text>
        <Text>
          {bankAccount?.bankName || "No Bank"}
        </Text>

        <Text>
          {bankAccount?.accountName}
        </Text>

        <Text>
          {bankAccount?.accountNumber}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setBankName(bankAccount?.bankName || "");
            setAccountName(bankAccount?.accountName || "");
            setAccountNumber(bankAccount?.accountNumber || "");
            setShowBankModal(true);
          }}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

      </View>

      <BankModal
  visible={showBankModal}
  onClose={() => setShowBankModal(false)}
  bankName={bankName}
  setBankName={setBankName}
  accountName={accountName}
  setAccountName={setAccountName}
  accountNumber={accountNumber}
  setAccountNumber={setAccountNumber}
  setBankAccount={setBankAccount}
/>

</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  balanceRow: {
  marginBottom: 20,
  gap: 16,
}, 

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    color: "#666",
    marginBottom: 16,
  },

  withdrawButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  withdrawText: {
    color: "#fff",
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  accountHeading: {
  fontSize: 15,
  color: "#6b7280",
  marginBottom: 18,
  fontWeight: "500",
},

  editButton: {
    marginTop: 15,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Wallet;