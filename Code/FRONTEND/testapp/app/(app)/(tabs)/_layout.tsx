import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../../constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="view-dashboard" color={color} />
          ),
          headerRight: () => (
            <Link href="/profile" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle-o"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Vision AI",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cube-scan" color={color} />
          ),
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map", // Título de la nueva pestaña
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-search" color={color} />
          ), // Icono de la nueva pestaña
          // Puedes añadir otras opciones como 'headerRight' si es necesario
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
