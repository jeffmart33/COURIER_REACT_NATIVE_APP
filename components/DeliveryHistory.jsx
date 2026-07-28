import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

function DeliveryHistory({ orders }) {
  if (!orders?.length) {
    return (
      <View style={styles.emptyCard}>
        <Text>No completed deliveries yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
<Text style={styles.sectionTitle}>
  Delivery History
</Text>

      {orders.map((order) => (
        <View
          key={order._id}
          style={styles.card}
        >
          <Text>📦 {order.orderNumber}</Text>

          <Text>
            🍗 {order.restaurantName}
          </Text>

          <Text>
            👤 {order.customerName}
          </Text>

          <Text>
            💰 €{order.fee}
          </Text>

          <Text style={styles.delivered}>
            ✅ Delivered
          </Text>

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 2,
  },

  delivered: {
    color: "#16a34a",
    fontWeight: "700",
    marginTop: 10,
  },

  sectionTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 16,
},

});

export default DeliveryHistory;