import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useCameraContext } from "../../contexts/CameraContext";
import { useAuth } from "../../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";


const screenWidth = Dimensions.get("window").width;
const imageWidth = screenWidth - 50; // Margen total de 40px (20px a cada lado)

const assignColorsToMaterials = (
  composition: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return Object.entries(composition).map(([material]) => {
    return { idContainer: getRecyclingColor(material) };
  });
};

const getRecyclingColor = (material: String) => {
  // Divide la frase en palabras y convierte a minúsculas
  const words = material.toLowerCase().split(" ");

  // Verifica si alguna palabra coincide con los casos conocidos
  for (const word of words) {
    switch (word) {
      case "plastic":
      case "metal":
      case "wood":
        return "yellow";
      case "glass":
        return "green";
      case "paper":
        return "blue";
      case "organic":
        return "brown";
      // Añade más casos según sea necesario
    }
  }

  // Valor por defecto si ninguna palabra coincide
  return "gray";
};

const CompositionBar = ({
  composition,
}: {
  composition: Record<string, string>;
}) => {
  // Función para calcular un porcentaje estimado a partir de diferentes formatos
  const calculatePercentage = (percentageString: string) => {
    // Para rangos como "~70-80%"
    const rangeMatch = percentageString.match(/(\d+)-(\d+)/);
    if (rangeMatch) {
      const [, min, max] = rangeMatch.map(Number);
      return (min + max) / 2; // Promedio del rango
    }

    // Para valores únicos con signo como "<5%" o ">85%"
    const valueMatch = percentageString.match(/(\d+)/);
    if (valueMatch) {
      return Number(valueMatch[0]); // Tomar el valor como está
    }

    return 0; // Por defecto si no se puede calcular
  };

  const compositionElements = Object.entries(composition).map(
    ([material, percentageString], index, array) => {
      const percentage = calculatePercentage(percentageString);
      const width = `${percentage}%`;
      const color = getRecyclingColor(material);

      return (
        <View
          key={material}
          style={{ width, height: 30, backgroundColor: color }}
        />
      );
    }
  );

  return (
    <View style={styles.compositionBarContainer}>
      <View style={styles.compositionBarInnerContainer}>
        {compositionElements}
      </View>
    </View>
  );
};

const CameraView = () => {
  const { image, setImageUri, gptVisionInfo } = useCameraContext();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [contenedoresDisponibles, setContenedoresDisponibles] = useState<string>();
  let container = "";

  const { user } = useAuth();

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  const onScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    if (isCloseToBottom(nativeEvent)) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: any;
    contentOffset: any;
    contentSize: any;
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderCompositionText = () => {
    if (gptVisionInfo && gptVisionInfo.data.composition) {
      return Object.entries(gptVisionInfo.data.composition).map(
        ([material, percentage]) => (
          <Text key={material} style={styles.compositionText}>
            {`${material}: ${percentage}`}
          </Text>
        )
      );
    }
    return null;
  };

  const handleGoBackToCamera = () => {
    setImageUri("");
  };

  // Formatear y mostrar la información de gptVisionInfo
  const renderGptVisionInfo = () => {
    if (!gptVisionInfo) {
      return <ActivityIndicator size="large" color="#007AFF" />;
    }

    const { description, moreInfo, composition } = gptVisionInfo.data;

    return (
      <View>
        {showMoreInfo && (
          <>
            <Text style={styles.infoText}>{description}</Text>
            {moreInfo && <Text style={styles.infoText}>{moreInfo}</Text>}
          </>
        )}
        <CompositionBar composition={composition} />
        <View style={styles.compositionTextContainer}>
          {renderCompositionText()}
        </View>
      </View>
    );
  };

  if (gptVisionInfo && gptVisionInfo.data.composition) {
    const containerColors = assignColorsToMaterials(
      gptVisionInfo.data.composition
    );
    const containers = containerColors.map(container => container.idContainer).join(', ');
    container = containers;
  }

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
    <ScrollView
      style={styles.scrollView}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        <Image source={{ uri: image.uri }} style={styles.image} />
        <View style={styles.infoContainer}>{renderGptVisionInfo()}</View>
        {gptVisionInfo && (
          <TouchableOpacity onPress={toggleMoreInfo} style={styles.infoButton}>
            <Text style={styles.infoButtonText}>Ver descripción</Text>
          </TouchableOpacity>
        )}
        {gptVisionInfo && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(app)/AvailableContainers",
                params: { containersAvailable: container },
              })
            }}
            style={[styles.queryButton, isAtBottom && styles.buttonAtBottom]}
          >
            <Text style={styles.queryButtonText}>Contenedores disponibles</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    resizeMode: "cover",
    borderRadius: 20,
    marginTop: 20,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noImageText: {
    fontSize: 18,
    color: "#333",
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
  infoButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  infoButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  compositionTextContainer: {
    marginTop: 10,
  },
  compositionText: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  buttonAtBottom: {
    marginBottom: 30,
  },
  compositionBarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    height: 30,
    flexDirection: "row",
  },
  compositionBarInnerContainer: {
    flexDirection: "row",
    height: "100%",
  },
  queryButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  queryButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CameraView;
