import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  AnimatedRegion,
} from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";

import API from "../services/api";

const courierBike = require("../assets/icons/courier-bike.png");
const restaurantIcon = require("../assets/icons/restaurant.png");
const customerIcon = require("../assets/icons/customer.png");

const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log(
  "Google Maps API Key:",
  GOOGLE_MAPS_API_KEY
);

export default function CourierMap({
  location,
  online,
  surge,
  router,
  activeOrder,
    orderStage,
}) {

  const mapRef = useRef(null);

  const lastCameraLocation = useRef(null);

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
  const [routeInfo, setRouteInfo] = useState({
  distance: 0,
  duration: 0,
});

const [routeCoordinates, setRouteCoordinates] = useState([]);

const [nextTurn, setNextTurn] = useState(null);
const [nextTurnDistance, setNextTurnDistance] = useState(null);

const [isOffRoute, setIsOffRoute] = useState(false);

const [rerouting, setRerouting] = useState(false);

const [routeKey, setRouteKey] = useState(0);

const [heading, setHeading] = useState(0);


const getDistanceMeters = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371000;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

const getDistanceToRoute = (
  courierLat,
  courierLng,
  coordinates
) => {
  if (!coordinates || coordinates.length === 0) {
    return Infinity;
  }

  let minimumDistance = Infinity;

  coordinates.forEach((point) => {
    const distance = getDistanceMeters(
      courierLat,
      courierLng,
      point.latitude,
      point.longitude
    );

    if (distance < minimumDistance) {
      minimumDistance = distance;
    }
  });

  return minimumDistance;
};

const loadNextTurn = async () => {
  if (
    !activeOrder ||
    !location ||
    !GOOGLE_MAPS_API_KEY
  ) {
    return;
  }

  const destination =
    orderStage === "Picked Up" ||
    orderStage === "Arrived at Customer Address" ||
    orderStage === "Delivered"
      ? activeOrder.dropoffLocation
      : activeOrder.pickupLocation;

  if (!destination?.coordinates) {
    return;
  }

  try {

    const origin =
      `${location.lat},${location.lng}`;

    const destinationCoords =
      `${destination.coordinates[1]},${destination.coordinates[0]}`;

    const url =
      `https://maps.googleapis.com/maps/api/directions/json` +
      `?origin=${origin}` +
      `&destination=${destinationCoords}` +
      `&mode=driving` +
      `&key=${GOOGLE_MAPS_API_KEY}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (
      data.status !== "OK" ||
      !data.routes?.length
    ) {
      console.log(
        "Next turn request failed:",
        data.status
      );

      return;
    }

    const legs =
      data.routes[0]?.legs;

    if (!legs?.length) {
      return;
    }

    const steps =
      legs[0]?.steps;

    if (!steps?.length) {
      return;
    }

    const firstStep = steps[0];

    setNextTurn(
      firstStep.html_instructions
        ?.replace(/<[^>]+>/g, "")
        || "Continue"
    );

    setNextTurnDistance(
      firstStep.distance?.text || ""
    );

  } catch (error) {

    console.log(
      "Next turn request failed:",
      error.message
    );

  }
};

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

  if (!activeOrder || !location) {
    setNextTurn(null);
    setNextTurnDistance(null);
    return;
  }

  loadNextTurn();

}, [
  location,
  activeOrder,
  orderStage,
  routeKey,
]);

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

  if (!location) return;

  animatedCoordinate.timing({
    latitude: location.lat,
    longitude: location.lng,
    duration: 700,
  }).start();

  if (typeof location.heading === "number") {
    setHeading(location.heading);
  }

  const speedKmh = (location?.speed || 0) * 3.6;

let zoom = 18;

if (speedKmh > 80) zoom = 17;
if (speedKmh > 120) zoom = 16;

const previous = lastCameraLocation.current;

if (
  previous &&
  getDistanceMeters(
    previous.lat,
    previous.lng,
    location.lat,
    location.lng
  ) < 8
) {
  return;
}

lastCameraLocation.current = {
  lat: location.lat,
  lng: location.lng,
};

mapRef.current?.animateCamera(
  {
    center: {
      latitude: location.lat,
      longitude: location.lng,
    },
    heading: location.heading || heading,
    pitch: 60,
    zoom,
  },
  {
    duration: 700,
  }
);
}, [location]);
  

useEffect(() => {

  if (
    !activeOrder ||
    !location ||
    routeCoordinates.length === 0
  ) {
    return;
  }

  const distanceToRoute =
    getDistanceToRoute(
      location.lat,
      location.lng,
      routeCoordinates
    );

  console.log(
    "Distance from route:",
    Math.round(distanceToRoute),
    "meters"
  );

  /*
   * Courier is considered off-route
   * when more than 80 meters away.
   */
  if (distanceToRoute > 80) {

    if (!isOffRoute) {

      console.log(
        "⚠️ COURIER IS OFF ROUTE"
      );

      console.log(
        "🔄 REQUESTING NEW ROUTE"
      );

      setIsOffRoute(true);
      setRerouting(true);

      /*
       * Force MapViewDirections to create
       * a completely new route.
       */
      setRouteKey((previous) => previous + 1);
    }

  } else {

    if (isOffRoute) {

      console.log(
        "✅ COURIER BACK ON ROUTE"
      );

      setIsOffRoute(false);
      setRerouting(false);
    }

  }

}, [
  location,
  activeOrder,
  routeCoordinates,
  isOffRoute,
]);

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

{activeOrder?.pickupLocation && (

  <Marker
coordinate={{
  latitude: activeOrder.pickupLocation.coordinates[1],
  longitude: activeOrder.pickupLocation.coordinates[0],
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

{activeOrder?.dropoffLocation && (

  <Marker
coordinate={{
  latitude: activeOrder.dropoffLocation.coordinates[1],
  longitude: activeOrder.dropoffLocation.coordinates[0],
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

{activeOrder?.pickupLocation &&
 activeOrder?.dropoffLocation &&
 GOOGLE_MAPS_API_KEY && (

<MapViewDirections
  key={routeKey}
  origin={{
    latitude: location.lat,
    longitude: location.lng,
  }}

destination={
  orderStage === "Picked Up" ||
  orderStage === "Arrived at Customer Address" ||
  orderStage === "Delivered"
    ? {
        latitude: activeOrder.dropoffLocation.coordinates[1],
        longitude: activeOrder.dropoffLocation.coordinates[0],
      }
    : {
        latitude: activeOrder.pickupLocation.coordinates[1],
        longitude: activeOrder.pickupLocation.coordinates[0],
      }
}

apikey={GOOGLE_MAPS_API_KEY}

  mode="DRIVING"
  strokeWidth={6}
  strokeColor="#ff8c09"
  optimizeWaypoints
  
  onError={(errorMessage) => {
  console.log("Directions Error:", errorMessage);
}}

onReady={(result) => {

  setRouteInfo({
    distance: result.distance,
    duration: result.duration,
  });

  setRouteCoordinates(
    result.coordinates || []
  );

  
  setRerouting(false);

  console.log(
    "✅ Route loaded:",
    result.distance,
    "km",
    result.duration,
    "minutes"
  );

}}
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

{/* ================= NEXT TURN ================= */}

{activeOrder && nextTurn && (

  <View style={styles.nextTurnCard}>

    <Text style={styles.nextTurnIcon}>
      🧭
    </Text>

    <View style={styles.nextTurnContent}>

      <Text style={styles.nextTurnTitle}>
        Next Turn
      </Text>

      <Text style={styles.nextTurnInstruction}>
        {nextTurn}
      </Text>

      {nextTurnDistance && (
        <Text style={styles.nextTurnDistance}>
          {nextTurnDistance}
        </Text>
      )}

    </View>

  </View>

)}

{/* ================= NAVIGATION CARD ================= */}

{activeOrder && (

<View style={styles.navigationCard}>

<Text style={styles.navigationTitle}>

{orderStage === "Picked Up" ||
orderStage === "Arrived at Customer Address"
? "🏠 Heading to Customer"
: "🍔 Heading to Restaurant"}

</Text>

<View style={styles.navigationRow}>

  <View style={styles.infoBox}>
    <Text style={styles.navigationLabel}>
      Speed
    </Text>

    <Text style={styles.navigationValue}>
      {Math.round((location?.speed || 0) * 3.6)} km/h
    </Text>
  </View>

  <View style={styles.infoBox}>
    <Text style={styles.navigationLabel}>
      Accuracy
    </Text>

    <Text style={styles.navigationValue}>
      {Math.round(location?.accuracy || 0)} m
    </Text>
  </View>

  <View style={styles.infoBox}>
    <Text style={styles.navigationLabel}>
      ETA
    </Text>

    <Text style={styles.navigationValue}>
      {Math.round(routeInfo.duration)} min
    </Text>
  </View>

  <View style={styles.infoBox}>
    <Text style={styles.navigationLabel}>
      Distance
    </Text>

    <Text
      style={styles.navigationValue}
      numberOfLines={1}
    >
      {routeInfo.distance.toFixed(1)} km
    </Text>
  </View>

</View>

<Text style={styles.navigationStage}>
{orderStage}
</Text>

{rerouting && (
  <Text style={styles.reroutingText}>
    🔄 Recalculating route...
  </Text>
)}

</View>

)}

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

navigationCard:{
  position:"absolute",
  top:12,
  left:12,
  right:12,

  backgroundColor:"#ffffffee",

  borderRadius:14,

  paddingHorizontal:12,
  paddingVertical:8,

  shadowColor:"#000",
  shadowOpacity:0.12,
  shadowRadius:6,
  shadowOffset:{
    width:0,
    height:3,
  },

  elevation:6,
},

navigationTitle:{
    fontSize:15,
    fontWeight:"700",
},

navigationRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:8,
},

infoBox:{
  flex:1,
  alignItems:"center",
  minWidth:40,
},

navigationLabel:{
    fontSize:10,
    color:"#6b7280",
},

navigationValue:{
    fontWeight:"700",
    fontSize:13,
    marginTop:2,
},

navigationStage:{
    marginTop:8,
    fontSize:13,
    color:"#16a34a",
    fontWeight:"700",
},

reroutingText: {
  marginTop: 6,
  color: "#ea580c",
  fontWeight: "700",
  fontSize: 12,
},

nextTurnCard: {
  position: "absolute",
  top: 85,
  left: 12,
  right: 12,

  backgroundColor: "#111827",

  borderRadius: 14,

  paddingHorizontal: 14,
  paddingVertical: 12,

  flexDirection: "row",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 8,
},

nextTurnIcon: {
  fontSize: 28,
  marginRight: 12,
},

nextTurnContent: {
  flex: 1,
},

nextTurnTitle: {
  color: "#9ca3af",
  fontSize: 11,
  fontWeight: "700",
  textTransform: "uppercase",
},

nextTurnInstruction: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
  marginTop: 2,
},

nextTurnDistance: {
  color: "#f97316",
  fontSize: 13,
  fontWeight: "700",
  marginTop: 3,
},


});

