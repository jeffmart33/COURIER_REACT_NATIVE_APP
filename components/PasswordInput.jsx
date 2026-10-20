import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const MARGINS = [
  "margin",
  "marginTop",
  "marginBottom",
  "marginVertical",
  "marginHorizontal",
  "marginLeft",
  "marginRight",
];

function PasswordInput({ style, ...props }) {
  const [visible, setVisible] = useState(false);

  const flat = StyleSheet.flatten(style) || {};

  const outer = {};
  const inner = {};

  Object.entries(flat).forEach(([key, value]) => {
    if (MARGINS.includes(key)) outer[key] = value;
    else inner[key] = value;
  });

  return (
    <View style={[styles.wrap, outer]}>
      <TextInput
        {...props}
        style={[inner, styles.input]}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.eye}
        onPress={() => setVisible(!visible)}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
        hitSlop={10}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#6b7280"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: "center",
  },

  input: {
    paddingRight: 48,
  },

  eye: {
    position: "absolute",
    right: 14,
  },
});

export default PasswordInput;
