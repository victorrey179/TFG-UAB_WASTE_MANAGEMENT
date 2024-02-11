import { CameraContextProvider } from "@/contexts/CameraContext";
import { Stack } from "expo-router";
export default function AppEntry() {
  return (
    <CameraContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTitle: "Vision AI" }} />
        <Stack.Screen name="profile" options={{ presentation: "modal" }} />
        <Stack.Screen name="AvailableContainers" options={{ presentation: "card" }} />
        <Stack.Screen name="containers/[id]" options={{ presentation: "modal", headerTitle: "Containers" }} />
      </Stack>
    </CameraContextProvider>
  );
}
