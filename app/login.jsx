import React, { useState } from "react";
import API from "../services/api";

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
import courierVideo from "../assets/images/couriervid.mp4";
import { finishLogin } from "../services/courierSession";
import { googleAccessToken } from "../services/googleSignIn";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
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

    alert("Login Successful");

    await finishLogin(response.data);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};

const handleGoogle = async () => {
  if (googleLoading) return;

  try {
    setGoogleLoading(true);

    const accessToken = await googleAccessToken();

    if (!accessToken) return;

    const response = await API.post("/api/auth/google", {
      access_token: accessToken,
    });

    if (response.data.needsProfile) {
      router.push({
        pathname: "/createaccount",
        params: {
          googleToken: accessToken,
          email: response.data.email,
          fullName: response.data.fullName || "",
        },
      });
      return;
    }

    await finishLogin(response.data);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message ||
      "Google sign in failed"
    );
  } finally {
    setGoogleLoading(false);
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

        <TouchableOpacity
  style={styles.googleButton}
  disabled={googleLoading}
  onPress={handleGoogle}
>
  <Text style={styles.googleText}>
    {googleLoading ? "Opening Google..." : "Continue with Google"}
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
    Deliver with Hooks Food
  </Text>

  <Text style={styles.bottomText}>
    Hooks Food connects courier partners to orders from trusted local restaurants in your city.
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

  googleButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  googleText: {
    color: "#111827",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
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