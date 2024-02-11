import { View, Text, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";

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

const IdZonePage = () => {
  const [containersData, setContainersData] = useState<Container[]>();
  return (
    <View style={styles.colorContainer}>
      {containersData && containersData.map((subContainer, index) => (
        <View
          key={index}
          style={[
            styles.roundView,
            {
              backgroundColor: getColor(subContainer.idContainer),
            },
          ]}
        ></View>
      ))}
    </View>
  );
};

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

export default IdZonePage;
