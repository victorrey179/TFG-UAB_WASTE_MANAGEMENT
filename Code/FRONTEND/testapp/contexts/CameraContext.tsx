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

// Crea el contexto con el valor inicial
const CameraContext = createContext<any>(null);

export function useCameraContext() {
  return useContext(CameraContext);
}

// Proveedor del contexto que envolverá la aplicación en App.tsx
export function CameraContextProvider({ children }: PropsWithChildren) {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [image, setImage] = useState<CameraCapturedPicture | undefined>();
  const rootSegments = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    console.log(rootSegments);
    console.log(imageUri);
    if (imageUri === undefined) return;
    if (imageUri) {
      router.push("/(app)/CameraView");
    } 
  }, [imageUri, rootSegments]);

  async function visionRequest(image: CameraCapturedPicture) {
    try {
      setImage(image);
      setImageUri(image.uri);
    } catch (e) {
      console.error("Error al capturar la imagen", e);
    }
  }

  return (
    <CameraContext.Provider
      value={{ image, imageUri, setImageUri, visionRequest }}
    >
      {children}
    </CameraContext.Provider>
  );
}
