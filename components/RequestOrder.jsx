import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

function RequestOrder({
  orders,
  acceptOrder,
  rejectOrder,
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

      {orders.map((order) => (

        <View
          key={order._id}
          style={styles.card}
        >

          <View style={styles.header}>
            <Text style={styles.headerText}>
              📦 New Delivery Request
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

            <Text style={styles.fee}>
              €{order.fee}
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

  body:{
    padding:20,
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