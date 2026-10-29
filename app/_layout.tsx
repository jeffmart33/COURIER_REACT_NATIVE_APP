import { Stack, router } from "expo-router";

import UpdateNotice from "../components/UpdateNotice";
import { whenSignedOut } from "../services/api";

import "../services/backgroundLocation";

whenSignedOut(() => router.replace("/login"));

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="courierdashboard" />
      </Stack>
      <UpdateNotice />
    </>
  );
}