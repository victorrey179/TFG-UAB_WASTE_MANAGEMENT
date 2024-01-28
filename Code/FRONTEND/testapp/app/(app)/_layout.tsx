import { CameraContextProvider } from "@/contexts/CameraContext";
import { Stack } from "expo-router";
export default function AppEntry() {
  return (
    <CameraContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ presentation: "modal" }} />
      </Stack>
    </CameraContextProvider>
  );
}
