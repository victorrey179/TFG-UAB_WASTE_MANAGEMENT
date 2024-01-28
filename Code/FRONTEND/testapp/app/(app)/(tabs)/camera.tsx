import { Camera, CameraType, FlashMode } from "expo-camera";
import { useState, useRef, useEffect, useContext } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import Colors from "../../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Text, View } from "../../../components/Themed";
import { useCameraContext } from "@/contexts/CameraContext";

const screenWidth = Dimensions.get("window").width;
const frameWidth = screenWidth - 100;

export default function Scanner() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const { visionRequest } = useCameraContext();

  useEffect(() => {
    setType(CameraType.back); // Establecer el tipo de cámara por defecto
    setFlashMode(FlashMode.off); // Establecer el modo de flash por defecto
  }, []);

  const colorScheme = useColorScheme();

  if (!permission) {
    return <View style={styles.container}></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission Required</Text>
        <Button onPress={requestPermission} title="Request Permission" />
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        visionRequest(photo, photo.uri);
      } catch (error) {
        console.error("Error al tomar foto:", error);
      }
    }
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function toggleFlashMode() {
    setFlashMode((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ref={cameraRef}
      >
        <View
          style={{
            ...styles.toolbar,
            backgroundColor: Colors[colorScheme ?? "light"].backgroundCamera,
          }}
        >
          {/* Botón de Flash */}
          <TouchableOpacity style={styles.button} onPress={toggleFlashMode}>
            <MaterialCommunityIcons
              name={flashMode === FlashMode.off ? "flash-off" : "flash"}
              size={40}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>

          {/* Botón de Tomar Foto (Agregar lógica para tomar foto) */}
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <MaterialCommunityIcons
              name="camera"
              size={60}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>

          {/* Botón de Cambiar Cámara */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <MaterialCommunityIcons
              name="camera-flip"
              size={40}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.frameStyle}></View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "relative",
    backgroundColor: "transparent",
  },
  button: {
    alignItems: "center",
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    height: 70,
    alignItems: "center", // Añade esta línea para centrar verticalmente
  },
  frameStyle: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: "transparent",
    width: frameWidth,
    height: frameWidth, // O ajusta la altura según tus necesidades
    top: "45%",
    left: "50%",
    transform: [
      { translateX: -(frameWidth / 2) },
      { translateY: -(frameWidth / 2) }, // Ajusta estos valores basados en el ancho calculado
    ],
  },
});