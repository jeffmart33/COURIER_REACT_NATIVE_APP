import { useLocalSearchParams } from "expo-router";
import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import * as Location from "expo-location";

import { router } from "expo-router";

import CourierMap from "../components/CourierMap";

export default function CourierNavigation() {

const {
  restaurantName,
  pickupAddress,
  dropoffAddress,
  stage,

  pickupLat,
  pickupLng,

  dropoffLat,
  dropoffLng,
} = useLocalSearchParams();

  const [location, setLocation] = useState({
  lat: 6.5244,
  lng: 3.3792,
});

const activeOrder = {
  pickupLocation: {
    coordinates: [
      Number(pickupLng),
      Number(pickupLat),
    ],
  },

  dropoffLocation: {
    coordinates: [
      Number(dropoffLng),
      Number(dropoffLat),
    ],
  },
};

useEffect(() => {

  let subscription;

  (async () => {

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") return;

    subscription =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (current) => {

          setLocation({

            lat: current.coords.latitude,
            lng: current.coords.longitude,
            heading: current.coords.heading ?? 0,
            speed: current.coords.speed ?? 0,
            accuracy: current.coords.accuracy ?? 0,

          });

        }
      );

  })();

  return () => {

    subscription?.remove();

  };

}, []);

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          🧭 Navigation
        </Text>

        <Text style={styles.stage}>
          {stage}
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.restaurant}>
          {restaurantName}
        </Text>

        <Text>
          📍 Pickup
        </Text>

        <Text style={styles.address}>
          {pickupAddress}
        </Text>

        <Text style={{ marginTop: 18 }}>
          🏠 Dropoff
        </Text>

        <Text style={styles.address}>
          {dropoffAddress}
        </Text>

      </View>

      <CourierMap
  location={location}
  online={true}
  surge="1x"
  router={router}
  activeOrder={activeOrder}
  orderStage={stage}
/>
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#fff",
  },

  header:{
    paddingTop:60,
    paddingHorizontal:20,
  },

  title:{
    fontSize:30,
    fontWeight:"700",
  },

  stage:{
    marginTop:8,
    color:"#16a34a",
    fontWeight:"700",
    fontSize:16,
  },

  card:{
    margin:20,
    padding:18,
    borderRadius:18,
    backgroundColor:"#fff",
    elevation:5,
  },

  restaurant:{
    fontSize:20,
    fontWeight:"700",
    marginBottom:15,
  },

  address:{
    color:"#6b7280",
  },

  mapPlaceholder:{
    flex:1,
    margin:20,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#e5e7eb",
  },

  placeholder:{
    fontSize:20,
    fontWeight:"700",
  },

});