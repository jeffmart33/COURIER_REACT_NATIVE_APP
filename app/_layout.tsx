import { Stack } from "expo-router";

import "../services/backgroundLocation";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="courierdashboard" />
    </Stack>
  );
}