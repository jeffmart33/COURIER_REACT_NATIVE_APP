import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import socket from "../services/socket";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import logo from "../assets/images/courierlog.png";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  registerForPushNotifications,
} from "../services/notifications";
import courierVideo from "../assets/images/couriervid.mp4";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const player = useVideoPlayer(courierVideo, (player) => {
  player.loop = true;
  player.muted = true;
  player.play();
});

const handleSignIn = async () => {
  if (loading) return;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    const response = await API.post("/api/auth/login", {
      email,
      password,
    });
    console.log(response.data);

    const token = response.data.token;

await AsyncStorage.setItem(
  "courierToken",
  token
);

await AsyncStorage.setItem(
  "courierUser",
  JSON.stringify(response.data.courier)
);

await AsyncStorage.setItem(
  "courierId",
  response.data.courier.id
);

// Register push token AFTER everything is saved
await registerForPushNotifications(token);



// Connect Socket
if (!socket.connected) {
  socket.connect();
}

// Register this courier with the backend
socket.emit(
  "register-courier",
  response.data.courier.id
);

alert("Login Successful");

router.replace("/courierdashboard");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* TOP INTRO */}

      <View style={styles.topSection}>
        <Text style={styles.heading}>
          Become a courier partner and deliver on your terms.
        </Text>

        <Text style={styles.description}>
          Choose when you deliver, receive fast payouts,
          and start earning in just a few steps.
        </Text>
      </View>

      {/* CARD */}

      <View style={styles.card}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.portal}>
          Courier Portal
        </Text>

        <Text style={styles.title}>
          Welcome Back, Rider
        </Text>

        <Text style={styles.subtitle}>
          Sign in to start delivering
        </Text>


        <TextInput
  placeholder="rider@example.com"
  placeholderTextColor="#6b7280"
  value={email}
  onChangeText={setEmail}
  style={styles.input}
/>

        <PasswordInput
  placeholder="••••••••"
  placeholderTextColor="#6b7280"
  value={password}
  onChangeText={setPassword}
  style={styles.input}
/>

        <TouchableOpacity
  style={styles.signInButton}
  disabled={loading}
  onPress={handleSignIn}
>
  <Text style={styles.signInText}>
    {loading ? "Signing In..." : "Sign In"}
  </Text>
</TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
  onPress={() => router.push("/forgotpassword")}
>
  <Text style={styles.link}>
    Forgot password?
  </Text>
</TouchableOpacity>

          <TouchableOpacity
  onPress={() => router.push("/createaccount")}
>
  <Text style={styles.link}>
    Create Account
  </Text>
</TouchableOpacity>
        </View>
      </View>

      {/* Bottom Text */}


<View style={styles.videoContainer}>
  <VideoView
    style={styles.video}
    player={player}
    allowsFullscreen={false}
    allowsPictureInPicture={false}
  />
</View>

<View style={styles.bottomInfo}>
  <Text style={styles.bottomTitle}>
    Trusted by 3.5+ million courier partners worldwide
  </Text>

  <Text style={styles.bottomText}>
    Hooks Food connects courier partners to thousands of daily orders from trusted local restaurants in your city.
  </Text>
</View>

</ScrollView>  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f97316",
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  topSection: {
    marginBottom: 35,
  },

  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },

  description: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fb923c",
    borderRadius: 22,
    padding: 25,
  },

  logo: {
    width: 130,
    height: 130,
    alignSelf: "center",
    resizeMode: "contain",
  },

  portal: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 15,
  },

  title: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },

  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
  },


  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  signInButton: {
    backgroundColor: "#ea580c",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  signInText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  link: {
    color: "#fff",
    fontWeight: "600",
  },

  bottom: {
    marginTop: 40,
  },

  bottomTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
    lineHeight: 34,
  },

  bottomText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },

  videoContainer: {
  marginTop: 20,
  borderRadius: 20,
  overflow: "hidden",
},

video: {
  width: "100%",
  height: 250,
},

bottomInfo: {
  marginTop: 30,
  paddingBottom: 40,
},

bottomTitle: {
  color: "#fff",
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
},

bottomText: {
  color: "#fff",
  textAlign: "center",
  marginTop: 15,
  lineHeight: 24,
  fontSize: 16,
},

});