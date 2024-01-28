import { Stack } from "expo-router";
export default function AppEntry() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="menu" options={{ presentation: "card" }} />
    </Stack>
  );
}
