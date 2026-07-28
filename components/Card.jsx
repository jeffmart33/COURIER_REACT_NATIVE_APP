import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

function Card({
  title,
  value,
}) {
  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  title: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 6,
  },

  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

});

export default Card;