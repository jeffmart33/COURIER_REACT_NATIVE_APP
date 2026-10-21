import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { formatMoney } from "../utils/helpers";

function WalletCard({
  title,
  amount,
  backgroundColor,
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.label}>
        {title}
      </Text>

      <Text style={styles.amount}>
        {formatMoney(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    marginHorizontal: 4,
  },

  label: {
    color: "#fff",
    fontSize: 14,
  },

  amount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },
});

export default WalletCard;