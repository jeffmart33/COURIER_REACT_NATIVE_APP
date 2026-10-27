import { Stack } from "expo-router";

import UpdateNotice from "../components/UpdateNotice";

import "../services/backgroundLocation";

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