import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import DeliveryHistory from "./DeliveryHistory";
import TransactionHistory from "./TransactionHistory";

function History({
  orders,
  transactions,
}) {
  const [activeTab, setActiveTab] = useState("delivery");

  return (
    <View style={{ flex: 1 }}>

      {/* Header */}

      <Text style={styles.title}>
        History
      </Text>

      {/* Tabs */}

      <View style={styles.tabs}>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "delivery" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setActiveTab("delivery")
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "delivery" &&
                styles.activeTabText,
            ]}
          >
            Delivery History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "transaction" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setActiveTab("transaction")
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "transaction" &&
                styles.activeTabText,
            ]}
          >
            Transaction History
          </Text>
        </TouchableOpacity>

      </View>

      {/* Content */}

      <View style={{ flex: 1 }}>

        {activeTab === "delivery" ? (
          <DeliveryHistory
            orders={orders}
          />
        ) : (
          <TransactionHistory
            transactions={transactions}
          />
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#2563eb",
  },

  tabText: {
    color: "#6b7280",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

});

export default History;