import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";

import { Image } from "expo-image";

import MapView, {
  Marker,
  Circle,
  Polyline,
  AnimatedRegion,
} from "react-native-maps";

import API from "../services/api";

const courierBike = require("../assets/icons/courier-bike.png");
const restaurantIcon = require("../assets/icons/restaurant.png");
const customerIcon = require("../assets/icons/customer.png");

export default function CourierMap({
  location,
  online,
  surge,
  router,
  activeOrder,
}) {

  const mapRef = useRef(null);

  const pulse = useRef(new Animated.Value(1)).current;

  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: location?.lat || 0,
      longitude: location?.lng || 0,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    })
  ).current;

  const [zones, setZones] = useState([]);

  const nearestZone = useMemo(() => {

    if (!location || zones.length === 0)
      return null;

    let nearest = null;

    zones.forEach((zone) => {

      const distance = Math.sqrt(
        Math.pow(zone.lat - location.lat, 2) +
        Math.pow(zone.lng - location.lng, 2)
      );

      if (!nearest || distance < nearest.distance) {
        nearest = {
          ...zone,
          distance,
        };
      }

    });

    return nearest;

  }, [zones, location]);

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          pulse,
          {
            toValue: 1.1,
            duration: 700,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          pulse,
          {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }
        ),

      ])

    ).start();

  }, []);

  useEffect(() => {

    if (!online) {
      setZones([]);
      return;
    }

    loadZones();

    const interval = setInterval(
      loadZones,
      15000
    );

    return () => clearInterval(interval);

  }, [online, location]);

  const loadZones = async () => {

    try {

      const res = await API.get(
        `/api/surge?lat=${location.lat}&lng=${location.lng}`
      );

      setZones(res.data || []);

    } catch (err) {

      console.log("Failed loading surge zones", err);

    }

  };

  useEffect(() => {

    if (!location)
      return;

    animatedCoordinate.timing({

      latitude: location.lat,
      longitude: location.lng,
      duration: 1000,

    }).start();

    if (mapRef.current) {

      mapRef.current.animateCamera(

        {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          zoom: 16,
        },

        {
          duration: 1000,
        }

      );

    }

  }, [location]);

  const routeCoordinates = [];

  if (location) {

    routeCoordinates.push({
      latitude: location.lat,
      longitude: location.lng,
    });

  }

  if (activeOrder?.restaurant?.location) {

    routeCoordinates.push({

      latitude:
        activeOrder.restaurant.location.lat,

      longitude:
        activeOrder.restaurant.location.lng,

    });

  }

  if (activeOrder?.customer?.location) {

    routeCoordinates.push({

      latitude:
        activeOrder.customer.location.lat,

      longitude:
        activeOrder.customer.location.lng,

    });

  }

  return (

    <View style={styles.container}>

      <MapView

        ref={mapRef}

        style={StyleSheet.absoluteFill}

        showsUserLocation={false}

        followsUserLocation={false}

        initialRegion={{
  latitude: location?.lat || 0,
  longitude: location?.lng || 0,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        >

{/* ================= COURIER ================= */}

<Marker.Animated
  coordinate={animatedCoordinate}
  title="You"
  description="Current Location"
  coordinate={animatedCoordinate}
  anchor={{
    x: 0.5,
    y: 0.5,
  }}
>
  <Image
    source={courierBike}
    style={{
      width: 52,
      height: 52,
    }}
    contentFit="contain"
  />
</Marker.Animated>

{/* ================= RESTAURANT ================= */}

{activeOrder?.restaurant?.location && (

  <Marker
    coordinate={{
      latitude: activeOrder.restaurant.location.lat,
      longitude: activeOrder.restaurant.location.lng,
    }}
    title="Restaurant"
  >

    <Image
      source={restaurantIcon}
      style={{
        width: 42,
        height: 42,
      }}
      contentFit="contain"
    />

  </Marker>

)}

{/* ================= CUSTOMER ================= */}

{activeOrder?.customer?.location && (

  <Marker
    coordinate={{
      latitude: activeOrder.customer.location.lat,
      longitude: activeOrder.customer.location.lng,
    }}
    title="Customer"
  >

    <Image
      source={customerIcon}
      style={{
        width: 42,
        height: 42,
      }}
      contentFit="contain"
    />

  </Marker>

)}

{/* ================= ROUTE ================= */}

{routeCoordinates.length >= 2 && (

  <Polyline

    coordinates={routeCoordinates}

    strokeWidth={6}

    strokeColor="#16a34a"

    lineCap="round"
lineJoin="round"
  />

)}

{/* ================= SURGE ZONES ================= */}

{zones.map((zone, index) => {

  const nearest =
    nearestZone &&
    nearestZone.lat === zone.lat &&
    nearestZone.lng === zone.lng;

 return (
  <React.Fragment key={index}>

    <Circle
      center={{
        latitude: zone.lat,
        longitude: zone.lng,
      }}
      radius={zone.radius}
      strokeWidth={2}
      strokeColor={
        nearest ? "#fb923c" : "#ef4444"
      }
      fillColor={
        nearest
          ? "rgba(251,146,60,0.35)"
          : "rgba(239,68,68,0.22)"
      }
    />

    <Marker
      coordinate={{
        latitude: zone.lat,
        longitude: zone.lng,
      }}
      onPress={() => {

        console.log("Pressed:", zone.multiplier);

        router.push({
          pathname: "/CourierEarnings",
          params: {
            multiplier: zone.multiplier,
          },
        });

      }}
    >

      <View
        style={{
          backgroundColor: nearest
            ? "#fb923c"
            : "#ef4444",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
          }}
        >
          🔥 {zone.multiplier}
        </Text>
      </View>

    </Marker>

  </React.Fragment>
);

})}

</MapView>

{/* ================= SURGE BUTTON ================= */}

<Animated.View

  style={[

    styles.surgeButton,

    {

      transform: [

        {

          scale: pulse,

        },

      ],

    },

  ]}

>

  <TouchableOpacity

    onPress={() =>

      router.push({

        pathname: "/CourierEarnings",

        params: {

          multiplier: online
            ? surge
            : "1x",

        },

      })

    }

  >

    <Text style={styles.surgeText}>

      🔥 {online ? surge : "1x"}

    </Text>

  </TouchableOpacity>

</Animated.View>
{/* ================= LOCATE BUTTON ================= */}

<TouchableOpacity
  style={styles.locateButton}
  onPress={() => {

    if (!mapRef.current) return;

    mapRef.current.animateCamera(
      {
        center: {
          latitude: location.lat,
          longitude: location.lng,
        },
        zoom: 17,
      },
      {
        duration: 700,
      }
    );

  }}
>

  <Text style={styles.locateIcon}>
    📍
  </Text>

</TouchableOpacity>

</View>

);
}

const styles = StyleSheet.create({

container:{
flex:1,
borderRadius:18,
overflow:"hidden",
},

surgeButton:{
position:"absolute",
top:15,
right:15,
backgroundColor:"#fff",
paddingHorizontal:16,
paddingVertical:10,
borderRadius:16,

shadowColor:"#000",
shadowOpacity:0.15,
shadowRadius:8,
shadowOffset:{
width:0,
height:4,
},

elevation:8,
},

surgeText:{
fontWeight:"700",
fontSize:16,
color:"#111827",
},

locateButton:{
position:"absolute",
bottom:20,
right:15,

width:54,
height:54,

borderRadius:27,

backgroundColor:"#fff",

justifyContent:"center",
alignItems:"center",

shadowColor:"#000",
shadowOpacity:0.18,
shadowRadius:8,
shadowOffset:{
width:0,
height:4,
},

elevation:8,
},

locateIcon:{
fontSize:26,
},

});

