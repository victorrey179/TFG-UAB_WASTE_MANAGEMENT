/* eslint-disable prettier/prettier */
// AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { useRouter, useSegments } from "expo-router";
import { Image } from "react-native";
import { CameraCapturedPicture } from "expo-camera";
import * as FileSystem from "expo-file-system";

interface ChoiceData {
  message: {
    role: string;
    content: string | null;
  };
  finish_reason: string;
  index: number;
}

interface CompositionData {
  [key: string]: string;
}

interface GeneralizedResponse {
  data: {
    description: string;
    moreInfo: string;
    composition: CompositionData;
  };
}

// Crea el contexto con el valor inicial
const CameraContext = createContext<any>(null);

export function useCameraContext() {
  return useContext(CameraContext);
}

// Proveedor del contexto que envolverá la aplicación en App.tsx
export function CameraContextProvider({ children }: PropsWithChildren) {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [image, setImage] = useState<CameraCapturedPicture | undefined>();
  const [gptVisionInfo, setGptVisionInfo] = useState<ChoiceData>();
  const rootSegments = useSegments()[0];
  const router = useRouter();

  const convertImageToBase64 = async (uri: string | undefined) => {
    if (uri) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              // Asegúrate de que reader.result es una cadena
              const base64 = reader.result.split(",")[1]; // Obtiene solo la parte base64
              resolve(base64);
            } else {
              reject("El resultado del FileReader no es una cadena");
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  useEffect(() => {
    if (imageUri === undefined) return;
    if (imageUri) {
      router.push("/(app)/CameraView");
    }
  }, [imageUri, rootSegments]);

  async function visionRequest(image: CameraCapturedPicture) {
    console.log("vision request");
    try {
      setImage(image);
      console.log(image.uri);
      const base64Image = await convertImageToBase64(image.uri);
      console.log("base 64");
      try {
        const response = await fetch("http://192.168.1.33:4000/visionGpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });
        const data = await response.json();
        console.log(data);
        setGptVisionInfo(data);
        setImageUri(image.uri);
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (e) {
      console.error("Error al capturar la imagen", e);
    }
  }

  return (
    <CameraContext.Provider
      value={{ image, imageUri, setImageUri, visionRequest, gptVisionInfo,setGptVisionInfo }}
    >
      {children}
    </CameraContext.Provider>
  );
}
