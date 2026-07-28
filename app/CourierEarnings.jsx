import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CourierEarnings() {
  const router = useRouter();

  const { multiplier } = useLocalSearchParams();

  const [openIndex, setOpenIndex] = useState(null);

  const [selectedDay, setSelectedDay] = useState(0);

  const days = [
    { name: "Sat", date: 27 },
    { name: "Sun", date: 28 },
    { name: "Mon", date: 29 },
    { name: "Tue", date: 30 },
    { name: "Wed", date: 31 },
    { name: "Thu", date: 1 },
    { name: "Fri", date: 2 },
  ];

  const data = [
    {
      time: "00:00 - 10:00",
      multiplier: "1x",
      details: [
        { label: "1 km", price: "€2.00" },
        { label: "2 km", price: "€2.80" },
        { label: "3 km", price: "€3.50" },
        { label: "Wait time", price: "€0.02" },
      ],
    },
    {
      time: "10:00 - 13:00",
      multiplier: "2.4x",
      details: [
        { label: "1 km", price: "€3.80" },
        { label: "2 km", price: "€4.90" },
        { label: "3 km", price: "€6.00" },
        { label: "Wait time", price: "€0.05" },
      ],
    },
    {
      time: "13:01 - 20:00",
      multiplier: "2.3x",
      details: [
        { label: "1 km", price: "€3.60" },
        { label: "2 km", price: "€4.70" },
        { label: "3 km", price: "€5.80" },
        { label: "Wait time", price: "€0.05" },
      ],
    },
    {
      time: "20:01 - 23:00",
      multiplier: "3x",
      details: [
        { label: "1 km", price: "€4.80" },
        { label: "2 km", price: "€5.85" },
        { label: "3 km", price: "€6.90" },
        { label: "4 km", price: "€7.95" },
        { label: "5 km", price: "€9.00" },
        { label: "Wait time", price: "€0.06" },
      ],
    },
    {
      time: "23:00 - 23:59",
      multiplier: "1x",
      details: [
        { label: "1 km", price: "€2.20" },
        { label: "2 km", price: "€3.00" },
        { label: "3 km", price: "€3.80" },
        { label: "Wait time", price: "€0.03" },
      ],
    },
  ];

  useEffect(() => {
    if (!multiplier) return;

    const index = data.findIndex(
      (item) => item.multiplier === multiplier
    );

    if (index !== -1) {
      setOpenIndex(index);
    }
  }, [multiplier]);

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

  <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()}
  >
    <Text style={styles.back}>
      ←
    </Text>
  </TouchableOpacity>

  <Text style={styles.title}>
    Courier Earning - Center
  </Text>

  <View style={{ width: 40 }} />

</View>
{/* ================= DAYS ================= */}

<View style={styles.daysWrapper}>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.daysContainer}
>

{days.map((day,index)=>(

<TouchableOpacity
key={index}
style={[
styles.dayCard,
selectedDay===index &&
styles.dayCardActive,
]}
onPress={()=>setSelectedDay(index)}
>

<Text
style={[
styles.dayName,
selectedDay===index &&
styles.dayNameActive,
]}
>
{day.name}
</Text>

<Text
style={[
styles.dayNumber,
selectedDay===index &&
styles.dayNumberActive,
]}
>
{day.date}
</Text>

</TouchableOpacity>

))}

</ScrollView>

</View>

      {/* Earnings */}

      <ScrollView
        style={{ flex: 1 }}
      >

        {data.map((item, index) => {

  const expanded = openIndex === index;

  return (

    <View
      key={index}
      style={styles.card}
    >

<TouchableOpacity
style={styles.row}
onPress={() => {

LayoutAnimation.configureNext(
LayoutAnimation.Presets.easeInEaseOut
);

setOpenIndex(
openIndex===index
?null
:index
);

}}>

<Text style={styles.cardTime}>
{item.time}
</Text>

<View style={styles.rightSection}>

<Text style={styles.cardMultiplier}>
{item.multiplier}
</Text>

<Text
style={[
styles.arrow,
openIndex===index &&
styles.arrowOpen,
]}
>
▼
</Text>

</View>

</TouchableOpacity>

      {expanded && (

        <View style={styles.details}>

          {item.details.map((detail, i) => (

<View
key={i}
style={styles.detailRow}
>

<Text style={styles.detailLabel}>
{detail.label}
</Text>

<Text style={styles.detailPrice}>
{detail.price}
</Text>

</View>
          ))}

        </View>

      )}

    </View>

  );

})}

<Text style={styles.footer}>
Prices are automatically updated according to demand and surge zones.
</Text>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
  },

  back: {
    color: "#fff",
    fontSize: 28,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* ================= DAYS ================= */

  daysWrapper: {
    marginBottom: 18,
  },

  daysContainer: {
    paddingHorizontal: 18,
  },

  dayCard: {
    width: 72,
    height: 82,
    borderRadius: 18,
    backgroundColor: "#1B2234",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  dayCardActive: {
  backgroundColor: "#16A34A",

  shadowColor: "#16A34A",

  shadowOpacity: 0.45,

  shadowRadius: 12,

  shadowOffset: {
    width: 0,
    height: 5,
  },

  elevation: 10,
},
  dayName: {
    color: "#A6ADBB",
    fontSize: 16,
    fontWeight: "500",
  },

  dayNameActive: {
    color: "#fff",
  },

  dayNumber: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 6,
  },

  dayNumberActive: {
    color: "#fff",
  },

  /* ================= EARNING CARD ================= */

card: {
  backgroundColor: "#141C2E",

  borderRadius: 22,

  marginHorizontal: 18,

  marginBottom: 18,

  paddingHorizontal: 22,

  paddingVertical: 20,

  shadowColor: "#000",

  shadowOpacity: 0.22,

  shadowRadius: 12,

  shadowOffset: {
    width: 0,
    height: 6,
  },

  elevation: 8,
},

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardTime: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "500",
  },

  cardMultiplier: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  arrow: {
    color: "#8D95A8",
    fontSize: 15,
    marginLeft: 12,
  },

  arrowOpen: {
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },

  /* ================= DETAILS ================= */

  details: {
    marginTop: 18,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#30394E",
  },

  detailLabel: {
    color: "#D3D7E2",
    fontSize: 17,
  },

  detailPrice: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  /* ================= FOOTER ================= */

  footer: {
    color: "#8A91A2",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 35,
    lineHeight: 22,
  },

  backButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
},

});