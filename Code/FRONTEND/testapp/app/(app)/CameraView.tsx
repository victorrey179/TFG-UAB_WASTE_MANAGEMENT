import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useCameraContext } from "../../contexts/CameraContext";
import { StatusBar } from "expo-status-bar";
import {useQuery, useMutation} from "@apollo/client"
import { ADD_POINTS } from "../../contexts/Queries";


const screenWidth = Dimensions.get("window").width;
const imageWidth = screenWidth - 50; // Margen total de 40px (20px a cada lado)

const CameraView = () => {
  const { image, setImageUri } = useCameraContext();

  const handleGoBackToCamera = () => {
    setImageUri("");
  };

  if (!image) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImageText}>No hay imagen</Text>
        <TouchableOpacity onPress={handleGoBackToCamera} style={styles.button}>
          <Text style={styles.buttonText}>Hacer otra foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Image source={{ uri: image.uri }} style={styles.image} />
      <View style={styles.infoContainer}>
        {/* Aquí mostrarías la información del servidor */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Fondo claro
    alignItems: "center",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    resizeMode: "cover",
    borderRadius: 20,
    marginTop: 20, // Espacio en la parte superior
  },
  infoContainer: {
    backgroundColor: "white", // Fondo blanco para la tarjeta
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000", // Sombra para la tarjeta
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noImageText: {
    fontSize: 18,
    color: "#333", // Texto oscuro para mejor lectura
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CameraView;
