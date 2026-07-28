import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

function ActiveOrder({
  order,
  stage,
  onNext,
}) {
if (!order) {
  return (
    <View style={styles.empty}>

      <Text style={styles.emptyIcon}>
        🏍️
      </Text>

      <Text style={styles.heading}>
        No Active Delivery
      </Text>

      <Text style={styles.emptyText}>
        You're currently waiting for a new delivery request.
      </Text>

      <View style={styles.tipCard}>

        <Text style={styles.tipTitle}>
          💡 While You Wait
        </Text>

        <Text style={styles.tipItem}>
          📍 Stay online to receive new orders.
        </Text>

        <Text style={styles.tipItem}>
          🔔 Keep notifications enabled.
        </Text>

        <Text style={styles.tipItem}>
          🚗 Make sure your vehicle is ready.
        </Text>

        <Text style={styles.tipItem}>
          ⚡ Respond quickly to increase your acceptance rate.
        </Text>

      </View>

    </View>
  );
}
  const stages = [
    "Assigned",
    "Heading to Restaurant",
    "Arrived at Restaurant",
    "Picked Up",
    "Arrived at Customer Address",
    "Delivered",
  ];

  return (
    <View>

      <Text style={styles.title}>
        Active Delivery
      </Text>

      <View style={styles.card}>

        <Text style={styles.restaurant}>
          {order.restaurantName}
        </Text>

        <Text>
          📦 Order ID: {order.id}
        </Text>

        <Text>
          👤 Customer: {
            stage === "Arrived at Restaurant" ||
            stage === "Picked Up" ||
            stage === "On the Way" ||
            stage === "Delivered"
              ? order.customerName
              : "🔒 Hidden"
          }
        </Text>

        <Text>
          📍 Pickup:
          {" "}
          {order.pickupAddress}
        </Text>

        <Text>
          🏠 Dropoff:
          {" "}
          {order.dropoffAddress}
        </Text>

        <Text>
          💳 Payment:
          {" "}
          {order.payment}
        </Text>

        <Text>
          🛣 Distance:
          {" "}
          {order.distance}
        </Text>

        <Text style={styles.fee}>
          💰 €{order.fee}
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.subtitle}>
          Delivery Progress
        </Text>

        {stages.map((item, index) => (

          <View
            key={item}
            style={[
              styles.stage,
              index <= stages.indexOf(stage)
                && styles.completed,
            ]}
          >

            <Text
              style={
                index <= stages.indexOf(stage)
                  ? styles.completedText
                  : null
              }
            >
              {item}
            </Text>

          </View>

        ))}

        {stage !== "Delivered" ? (

          <TouchableOpacity
            style={styles.button}
            onPress={onNext}
          >

            <Text style={styles.buttonText}>
              Next Step →
            </Text>

          </TouchableOpacity>

        ) : (

          <Text style={styles.done}>
            ✔ Delivery Completed
          </Text>

        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  title:{
    fontSize:24,
    fontWeight:"700",
    marginBottom:20,
  },

  empty:{
  backgroundColor:"#fff",
  padding:25,
  borderRadius:20,
  alignItems:"center",
},
  heading:{
  fontSize:22,
  fontWeight:"700",
  marginBottom:8,
  textAlign:"center",
  color:"#111827",
},

  card:{
    backgroundColor:"#fff",
    borderRadius:20,
    padding:20,
    marginBottom:20,
  },

  restaurant:{
    fontSize:18,
    fontWeight:"700",
    marginBottom:15,
  },

  fee:{
    color:"#16a34a",
    fontWeight:"700",
    marginTop:10,
  },

  subtitle:{
    fontWeight:"700",
    marginBottom:15,
  },

  stage:{
    backgroundColor:"#e5e7eb",
    borderRadius:30,
    padding:10,
    marginBottom:10,
  },

  completed:{
    backgroundColor:"#16a34a",
  },

  completedText:{
    color:"#fff",
  },

  button:{
    backgroundColor:"#2563eb",
    marginTop:20,
    padding:14,
    borderRadius:10,
    alignItems:"center",
  },

  buttonText:{
    color:"#fff",
    fontWeight:"700",
  },

  done:{
    color:"#16a34a",
    fontWeight:"700",
    marginTop:20,
  },

  emptyIcon: {
  fontSize: 70,
  textAlign: "center",
  marginBottom: 15,
},

emptyText: {
  textAlign: "center",
  color: "#6b7280",
  fontSize: 15,
  lineHeight: 22,
  marginTop: 10,
  marginBottom: 25,
},

tipCard: {
  backgroundColor: "#fff7ed",
  borderRadius: 16,
  padding: 18,
  borderWidth: 1,
  borderColor: "#fdba74",
},

tipTitle: {
  fontSize: 17,
  fontWeight: "700",
  color: "#ea580c",
  marginBottom: 12,
},

tipItem: {
  fontSize: 15,
  color: "#374151",
  marginBottom: 10,
  lineHeight: 22,
},

});

export default ActiveOrder;