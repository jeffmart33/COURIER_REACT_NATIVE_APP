import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const formatDistance = (meters) => {
  if (meters === null || meters === undefined) return "-";

  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
};

const formatMinutes = (seconds) =>
  seconds ? `${Math.max(1, Math.round(seconds / 60))} min` : "-";

const formatFee = (order) =>
  `${order.currency === "EUR" ? "€" : "₦"}${Number(order.fee || 0).toLocaleString()}`;

function RequestOrder({
  orders,
  acceptOrder,
  rejectOrder,
  secondsLeft = 0,
}) {

  if (!orders?.length) {
  return (
    <View style={styles.empty}>

      <Text style={styles.emptyIcon}>
        🏍️
      </Text>

      <Text style={styles.heading}>
        No Delivery Requests
      </Text>

      <Text style={styles.emptyText}>
        You're online and waiting for nearby delivery requests.
      </Text>

      <View style={styles.tipCard}>

        <Text style={styles.tipTitle}>
          💡 Stay Ready
        </Text>

        <Text style={styles.tipItem}>
          📍 Stay close to busy restaurants.
        </Text>

        <Text style={styles.tipItem}>
          🔔 Keep notifications turned on.
        </Text>

        <Text style={styles.tipItem}>
          🏍️ Keep your bike fueled and ready.
        </Text>

        <Text style={styles.tipItem}>
          ⚡ Accept requests quickly to earn more.
        </Text>

      </View>

    </View>
  );
}

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >

      {orders.map((order, index) => (

        <View
          key={order._id}
          style={styles.card}
        >

          <View style={styles.header}>
            <Text style={styles.headerText}>
              📦 New Delivery Request
            </Text>

            <Text style={styles.headerSub}>
              Order {order.externalReference || order.orderNumber}
              {index === 0 && secondsLeft > 0
                ? ` · ${secondsLeft}s to answer`
                : ""}
            </Text>
          </View>

          <View style={styles.body}>

            <Text>
              Restaurant:
            </Text>

            <Text style={styles.bold}>
              {order.restaurantName}
            </Text>

            <Text>
              Customer:
            </Text>

            <Text style={styles.gray}>
              🔒 Hidden until you arrive
            </Text>

            <Text>
              Pickup:
            </Text>

            <Text style={styles.bold}>
              {order.pickupAddress}
            </Text>

            <Text>
              Dropoff:
            </Text>

            <Text style={styles.bold}>
              {order.dropoffAddress}
            </Text>

            {order.offer && (
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>To pickup</Text>
                  <Text style={styles.statValue}>
                    {formatDistance(order.offer.distanceToPickupM)}
                  </Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Trip</Text>
                  <Text style={styles.statValue}>
                    {formatDistance(order.offer.tripDistanceM)}
                  </Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Est. delivery</Text>
                  <Text style={styles.statValue}>
                    {formatMinutes(
                      (order.offer.etaToPickupSeconds || 0) +
                        (order.offer.tripEtaSeconds || 0)
                    )}
                  </Text>
                </View>
              </View>
            )}

            {order.items?.length > 0 && (
              <>
                <Text>
                  Items:
                </Text>

                <Text style={styles.bold}>
                  {order.items
                    .map((item) => `${item.quantity}× ${item.name}`)
                    .join(", ")}
                </Text>
              </>
            )}

            <Text style={styles.fee}>
              {formatFee(order)}
            </Text>

            <View style={styles.buttons}>

              <TouchableOpacity
                style={styles.accept}
                onPress={() =>
                  acceptOrder(order)
                }
              >

                <Text style={styles.white}>
                  Accept
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reject}
                onPress={() =>
                  rejectOrder(order)
                }
              >

                <Text style={styles.white}>
                  Decline
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  empty:{
  backgroundColor:"#fff",
  padding:25,
  borderRadius:20,
  alignItems:"center",
},

emptyIcon:{
  fontSize:70,
  marginBottom:15,
},

heading:{
  fontSize:22,
  fontWeight:"700",
  textAlign:"center",
  color:"#111827",
  marginBottom:10,
},

emptyText:{
  textAlign:"center",
  color:"#6b7280",
  fontSize:15,
  lineHeight:22,
  marginBottom:25,
},

tipCard:{
  width:"100%",
  backgroundColor:"#fff7ed",
  borderRadius:16,
  padding:18,
  borderWidth:1,
  borderColor:"#fdba74",
},

tipTitle:{
  fontSize:17,
  fontWeight:"700",
  color:"#ea580c",
  marginBottom:12,
},

tipItem:{
  fontSize:15,
  color:"#374151",
  marginBottom:10,
  lineHeight:22,
},

  card:{
    backgroundColor:"#fff",
    borderRadius:20,
    overflow:"hidden",
    marginBottom:20,
    elevation:2,
  },

  header:{
    backgroundColor:"#16a34a",
    padding:18,
  },

  headerText:{
    color:"#fff",
    fontWeight:"700",
    fontSize:18,
  },

  headerSub:{
    color:"#dcfce7",
    marginTop:4,
    fontSize:13,
  },

  body:{
    padding:20,
  },

  stats:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:12,
  },

  stat:{
    flex:1,
    backgroundColor:"#f3f4f6",
    borderRadius:10,
    padding:8,
    marginRight:6,
  },

  statLabel:{
    color:"#6b7280",
    fontSize:11,
  },

  statValue:{
    fontWeight:"700",
    fontSize:14,
    marginTop:2,
  },

  bold:{
    fontWeight:"700",
    marginBottom:12,
  },

  gray:{
    color:"#777",
    marginBottom:12,
  },

  fee:{
    color:"#16a34a",
    fontWeight:"700",
    fontSize:18,
    marginVertical:15,
  },

  buttons:{
    flexDirection:"row",
    justifyContent:"space-between",
  },

  accept:{
    flex:1,
    backgroundColor:"#16a34a",
    padding:14,
    borderRadius:10,
    alignItems:"center",
    marginRight:8,
  },

  reject:{
    flex:1,
    backgroundColor:"#dc2626",
    padding:14,
    borderRadius:10,
    alignItems:"center",
  },

  white:{
    color:"#fff",
    fontWeight:"700",
  },

});

export default RequestOrder;