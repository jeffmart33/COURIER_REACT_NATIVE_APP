import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import * as Clipboard from "expo-clipboard";

function Referral({ profileData }) {
  const referralCode =
    profileData?.referralCode || "...";

  const referralLink =
    `https://getcoredispatch.cloud/register?ref=${referralCode}`;

  const copyText = async (text) => {
    try {
      await Clipboard.setStringAsync(text);

      Alert.alert(
        "Success",
        "Copied successfully."
      );
    } catch {
      Alert.alert(
        "Error",
        "Unable to copy."
      );
    }
  };

    return (
<ScrollView
  style={styles.container}
  contentContainerStyle={{
    paddingBottom: 100,
  }}
  showsVerticalScrollIndicator={false}
>

      {/* Header */}

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          🎁 Referral Program
        </Text>

        <Text style={styles.headerText}>
          Share your code with other riders who want to join Hooks.
        </Text>

      </View>

      {/* Top Cards */}

      <View style={styles.row}>

        <View style={styles.card}>

          <Text style={styles.label}>
            Referral Code
          </Text>

          <Text style={styles.code}>
            {referralCode}
          </Text>

          <TouchableOpacity
            style={styles.orangeButton}
            onPress={() => copyText(referralCode)}
          >
            <Text style={styles.buttonText}>
              📋 Copy Code
            </Text>
          </TouchableOpacity>

        </View>

      </View>

      {/* Referral Link */}

      <View style={styles.card}>

        <Text style={styles.label}>
          Referral Link
        </Text>

        <View style={styles.linkBox}>
          <Text>{referralLink}</Text>
        </View>

        <TouchableOpacity
          style={styles.blueButton}
          onPress={() => copyText(referralLink)}
        >
          <Text style={styles.buttonText}>
            🔗 Copy Referral Link
          </Text>
        </TouchableOpacity>

      </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 18,
  },

  header: {
    backgroundColor: "#f97316",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  headerText: {
    color: "#fff",
    marginTop: 10,
  },

  row: {
    flexDirection: "column",
    marginBottom: 20,
},

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    flex: 1,
  },


  statCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },

  label: {
    color: "#6b7280",
    marginBottom: 10,
  },

  code: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ea580c",
  },


  stat: {
    fontSize: 28,
    fontWeight: "700",
  },

  greenStat: {
    fontSize: 28,
    fontWeight: "700",
    color: "#16a34a",
  },


  linkBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 12,
    marginVertical: 15,
  },

  orangeButton: {
    marginTop: 20,
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  blueButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

});

export default Referral;