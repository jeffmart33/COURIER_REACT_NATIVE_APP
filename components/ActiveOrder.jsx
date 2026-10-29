import React, { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";

import NavigationAppModal from "./NavigationAppModal";

function ActiveOrder({
  order,
  stage,
  onNext,
}) {
  const [deliveryCode, setDeliveryCode] = useState("");


  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const router = useRouter();

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
    "On the Way",
    "Arrived at Customer Address",
    "Delivered",
  ];

  const stageIndex = stages.indexOf(stage);

  const customerVisible =
    stageIndex >= stages.indexOf("Arrived at Restaurant");

  const beforePickup =
    stageIndex < stages.indexOf("Picked Up");

  const currency = order.currency === "EUR" ? "€" : "₦";

return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Active Delivery
      </Text>

      <View style={styles.card}>

        <Text style={styles.restaurant}>
          {order.restaurantName}
        </Text>

        <Text>
          📦 Order: {order.externalReference || order.orderNumber}
        </Text>

        <Text>
          👤 Customer: {
            customerVisible
              ? `${order.customerName}${order.customerPhone ? ` · ${order.customerPhone}` : ""}`
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

<View
  style={{
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  }}
>

  <TouchableOpacity
    style={[
      styles.navigateButton,
      { flex: 1 },
    ]}
    onPress={() =>
      router.push({
        pathname: "/CourierNavigation",
        params: {
  orderId: order._id,
  stage,

  restaurantName: order.restaurantName,
  pickupAddress: order.pickupAddress,
  dropoffAddress: order.dropoffAddress,

  pickupLat: order.pickupLocation.coordinates[1],
  pickupLng: order.pickupLocation.coordinates[0],

  dropoffLat: order.dropoffLocation.coordinates[1],
  dropoffLng: order.dropoffLocation.coordinates[0],
},
      })
    }
  >
    <Text style={styles.navigateButtonText}>
      📍 In-App Navigation
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.navigateButton,
      {
        flex: 1,
        backgroundColor: "#2563eb",
      },
    ]}
    onPress={() => setShowNavigationModal(true)}
  >
    <Text style={styles.navigateButtonText}>
      🌍 Google Maps
    </Text>
  </TouchableOpacity>

</View>
        {order.dropoffInstructions ? (
          <Text>
            📝 Note: {order.dropoffInstructions}
          </Text>
        ) : null}

        {order.metadata?.payment_method ? (
          <Text>
            💳 Payment:
            {" "}
            {String(order.metadata.payment_method).replace(/_/g, " ")}
          </Text>
        ) : null}

        {order.items?.length > 0 && (
          <View style={styles.items}>
            <Text style={styles.itemsTitle}>
              🧾 Items to collect
            </Text>

            {order.items.map((item, index) => (
              <Text key={`${item.name}-${index}`}>
                {item.quantity}× {item.name}
                {item.note ? ` (${item.note})` : ""}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.fee}>
          💰 {currency}{Number(order.fee || 0).toLocaleString()}
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
              index <= stageIndex
                && styles.completed,
            ]}
          >

            <Text
              style={
                index <= stageIndex
                  ? styles.completedText
                  : null
              }
            >
              {item}
            </Text>

          </View>

        ))}

        {stage === "Arrived at Customer Address" && (
          <TextInput
            value={deliveryCode}
            onChangeText={(value) => setDeliveryCode(value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Delivery code from the customer"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            maxLength={4}
            accessibilityLabel="Delivery code"
            style={styles.codeInput}
          />
        )}

        {stage !== "Delivered" ? (

          <TouchableOpacity
            style={styles.button}
            onPress={() => onNext(stage === "Arrived at Customer Address" ? deliveryCode : undefined)}
          >

            <Text style={styles.buttonText}>
              {NEXT_ACTION[stage] || "Next Step →"}
            </Text>

          </TouchableOpacity>

        ) : (

          <Text style={styles.done}>
            ✔ Delivery Completed
          </Text>

        )}
<NavigationAppModal
  visible={showNavigationModal}
  onClose={() => setShowNavigationModal(false)}
  destination={beforePickup ? order.pickupAddress : order.dropoffAddress}
/>
      </View>

    </ScrollView>
    
  );
}

const NEXT_ACTION = {
  Assigned: "Start to pickup",
  "Heading to Restaurant": "I have arrived at pickup",
  "Arrived at Restaurant": "Confirm pickup",
  "Picked Up": "Start delivery",
  "On the Way": "I have arrived at customer",
  "Arrived at Customer Address": "Confirm delivery",
};

const styles = StyleSheet.create({

  items:{
    marginTop:10,
    padding:10,
    borderRadius:10,
    backgroundColor:"#f9fafb",
  },

  itemsTitle:{
    fontWeight:"700",
    marginBottom:4,
  },


    contentContainer: {
    paddingBottom: 140,
  },

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

  codeInput:{
    marginTop:20,
    borderWidth:1,
    borderColor:"#cbd5e1",
    borderRadius:10,
    padding:12,
    fontSize:20,
    letterSpacing:6,
    textAlign:"center",
    color:"#0f172a",
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

navigateButton: {
  backgroundColor: "#f97316",
  marginTop: 15,
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
},

navigateButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 16,
},

});

export default ActiveOrder;