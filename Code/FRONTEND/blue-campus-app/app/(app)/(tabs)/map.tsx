import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons"; // Importa el icono

export default function TabTwoScreen() {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      updateRegion(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const updateRegion = (latitude, longitude) => {
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <>
          <MapView ref={mapRef} style={styles.map} initialRegion={region}>
            <Marker
              coordinate={region}
              title={"Tu ubicación"}
              description={"Aquí estás actualmente"}
              pinColor="#2f95dc"
            />
          </MapView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateRegion(region.latitude, region.longitude)}
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#2f95dc" hidesWhenStopped />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centrar contenido verticalmente
    alignItems: 'center', // Centrar contenido horizontalmente
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
