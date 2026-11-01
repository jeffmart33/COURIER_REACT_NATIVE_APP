import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { formatMoney } from "../utils/helpers";

export const WITHDRAWAL_STATUS = {
  pending: ["Waiting for approval", "#b45309"],
  approved: ["Approved, sending soon", "#2563eb"],
  processing: ["Sending to your bank", "#2563eb"],
  successful: ["Paid to your bank", "#16a34a"],
  failed: ["Payment failed, money returned", "#dc2626"],
  rejected: ["Rejected, money returned", "#dc2626"],
};

function TransactionHistory({
  transactions,
}) {

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View>

        <Text style={styles.title}>
          {item.type === "withdrawal"
            ? "Withdrawal"
            : "Delivery"}
        </Text>

        <Text style={styles.date}>
          {new Date(
  item.createdAt || item.date
).toLocaleDateString()}
        </Text>

      </View>

      <View style={styles.right}>

        <Text
          style={[
            styles.amount,
            {
              color:
                item.type === "withdrawal"
                  ? "#dc2626"
                  : "#16a34a",
            },
          ]}
        >
          {item.type === "withdrawal"
            ? "-"
            : "+"}
          {formatMoney(item.amount)}
        </Text>

        <Text
          style={[
            styles.status,
            WITHDRAWAL_STATUS[item.withdrawalStatus]
              ? { color: WITHDRAWAL_STATUS[item.withdrawalStatus][1] }
              : null,
          ]}
        >
          {WITHDRAWAL_STATUS[item.withdrawalStatus]?.[0] || item.status}
        </Text>

        {item.withdrawalReason ? (
          <Text style={styles.reason}>
            {item.withdrawalReason}
          </Text>
        ) : null}

      </View>

    </View>

  );

  if (!transactions?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No transactions yet
        </Text>
      </View>
    );
  }

  return (
    <View>

<Text style={styles.heading}>
  Transaction History
</Text>

     <FlatList
  data={transactions}
  keyExtractor={(item, index) =>
    (item._id || item.id || index).toString()
  }
  renderItem={renderItem}
/>

    </View>
  );
}

const styles = StyleSheet.create({

  heading: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 16,
},

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  date: {
    color: "#6b7280",
    marginTop: 4,
  },

  right: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 16,
    fontWeight: "700",
  },

  status: {
    marginTop: 4,
    color: "#2563eb",
  },

  reason: {
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
    maxWidth: 180,
    textAlign: "right",
  },

  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "#6b7280",
  },

});

export default TransactionHistory;