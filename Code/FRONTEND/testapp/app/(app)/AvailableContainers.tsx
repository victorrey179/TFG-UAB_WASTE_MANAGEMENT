import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Button,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { COORDINATES_CONTAINERS } from "../../contexts/Queries";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useServerContext } from "../../contexts/ServerContext";

interface Container {
  idContainer: string;
}

interface LocationInfo {
  distance?: number;
  containers: Container[];
  coordinates: [number, number];
  idZone: string;
  isVisible: boolean;
}

// Tipo para la respuesta de la API
interface ApiResponse {
  allInfo: LocationInfo[];
}

const getColor = (idContainer: string) => {
  switch (idContainer) {
    case "amarillo":
      return "yellow";
    case "azul":
      return "blue";
    case "verde":
      return "green";
    case "marron":
      return "brown";
    // Agrega más casos según sea necesario
    default:
      return "gray";
  }
};

export default function AvailableContainers() {
  const [containersData, setContainersData] = useState<ApiResponse>();
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();
  const [selectedContainers, setSelectedContainers] = useState<number[]>([]); // Tipo explícito aquí
  // Consulta para obtener la información de los contenedores
  const { loading, error, data } = useQuery<ApiResponse>(
    COORDINATES_CONTAINERS
  );
  if (loading) {
    return (
      <View style={styles.containerAll}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.containerAll}>
        <Text>Error! {error.message}</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (data && currentLocation) {
      const newData = data.allInfo.map((info) => {
        const distance = calculateDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          info.coordinates[0],
          info.coordinates[1]
        );
        return { ...info, distance };
      });

      newData.sort((a, b) => a.distance - b.distance);
      setContainersData({ ...data, allInfo: newData });
    }
  }, [data, currentLocation]);

  // Función para calcular la distancia usando la fórmula de Haversine
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Devuelve la distancia en km
  };

  const toRad = (Value: number) => {
    return (Value * Math.PI) / 180;
  };

  const toggleVisibility = (idZone: string) => {
    if (containersData) {
      const newData = {
        ...containersData,
        allInfo: containersData.allInfo.map((info) =>
          info.idZone === idZone
            ? { ...info, isVisible: !info.isVisible }
            : info
        ),
      };
      setContainersData(newData);
    }
  };
  if (!containersData) {
    return (
      <View style={styles.containerAll}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const toggleContainer = (index: number) => {
    setSelectedContainers((currentSelected) =>
      currentSelected.includes(index)
        ? currentSelected.filter((i) => i !== index)
        : [...currentSelected, index]
    );
  };

  const handleThrow = () => {
    console.log("Contenedores seleccionados:", selectedContainers);
    // Aquí la lógica para "tirar" y ganar puntos
  };

  return (
    <ScrollView style={styles.scrollView}>
      {containersData &&
        containersData.allInfo.map((container) => (
          <View key={container.idZone} style={styles.container}>
            <View style={styles.titleContainer}>
              <View style={styles.titleAndDistance}>
                <Text style={styles.title}>{container.idZone}</Text>
                {container.distance && (
                  <Text style={styles.distance}>
                    {container.distance.toFixed(2)} km
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => toggleVisibility(container.idZone)}
                style={styles.iconButton}
              >
                <MaterialIcons
                  name={
                    container.isVisible
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={40}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {container.isVisible && (
              <View style={styles.additionalInfo}>
                <Text style={styles.description}>
                  Escoge los contenedores disponibles
                </Text>
                <View>
                  <View style={styles.colorContainer}>
                    {container.containers.map((subContainer, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleContainer(index)}
                      >
                        <View
                          style={[
                            styles.roundView,
                            {
                              backgroundColor: getColor(
                                subContainer.idContainer
                              ),
                              opacity: selectedContainers.includes(index)
                                ? 0.5
                                : 1,
                            },
                          ]}
                        ></View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {selectedContainers.length > 0 && (
                    <Button
                      title="Tirar y Ganar Puntos"
                      onPress={() =>
                        router.push({
                          pathname: "/(app)/containers/[id]",
                          params: { id: container.idZone },
                        })
                      }
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white", // Fondo del ScrollView
  },
  container: {
    backgroundColor: "#f0f0f0", // Color de fondo de cada contenedor
    padding: 20, // Espaciado interno
    marginVertical: 10, // Espacio vertical entre contenedores
    marginHorizontal: 15, // Margen horizontal
    borderRadius: 10, // Bordes redondeados
    shadowColor: "#000", // Color de sombra
    shadowOffset: { width: 0, height: 1 }, // Desplazamiento de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 1.41, // Radio de la sombra
    elevation: 2, // Elevación en Android
  },
  containerAll: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25, // Tamaño de fuente para el título
    fontWeight: "bold", // Negrita para el título
  },
  description: {
    fontSize: 20, // Tamaño de fuente para la descripción
    color: "gray", // Color de la descripción
  },
  additionalInfo: {
    marginTop: 10,
  },
  roundView: {
    width: 50,
    height: 50,
    borderRadius: 25, // Esto hace que la vista sea redonda
    justifyContent: "center",
    alignItems: "center",
    margin: 5, // Espaciado entre las vistas
  },
  colorContainer: {
    flexDirection: "row", // Alinea los elementos horizontalmente
    flexWrap: "wrap", // Permite que los elementos se envuelvan en varias líneas si no caben en una sola
    justifyContent: "center", // Centra los elementos horizontalmente
    alignItems: "center", // Centra los elementos verticalmente
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {},
  titleAndDistance: {
    flexDirection: "row",
    alignItems: "center",
  },
  distance: {
    fontSize: 18,
    color: "gray",
    marginLeft: 10, // Espacio entre el título y la distancia
  },
});
