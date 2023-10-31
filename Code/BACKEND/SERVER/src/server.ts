import express from "express";
import os from "os";
import cors from "cors";
import * as admin from "firebase-admin";
import serviceAccount from "./fbaccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

const app = express();
const port = 3050;

app.use(express.json());
app.use(cors());

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (const alias of iface!) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "0.0.0.0";
}

//const localIp = getLocalIp();
const localIp = "192.168.1.161";
console.log(`Local IP Address: ${localIp}`);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

interface DataPayload {
  location: string;
  signal: number;
  temperature: number;
  humidity: number;
  distance: number;
  x: number;
  y: number;
  z: number;
}

app.post("/data", async (req, res) => {
  const {
    location,
    x,
    y,
    z,
    distance,
    humidity,
    signal,
    temperature,
  }: DataPayload = req.body;

  // Dividir la ubicación para obtener los identificadores de los documentos
  const [zone, , containerColor] = location.split("_");
  const zoneId = zone; // Ejemplo: 'Z1'
  const containerId = containerColor.toLowerCase(); // Ejemplo: 'azul'
  const dateId = Date.now.toString(); // Ejemplo: '2023-10-31'

  try {
    // Referencia a la colección 'location' y al documento específico 'zoneId'
    const zoneDocRef = db.collection("location").doc(zoneId);

    // Referencia a la subcolección 'containers' y al documento específico 'containerId'
    const containerDocRef = zoneDocRef
      .collection("containers")
      .doc(containerId);

    // Actualizar el campo 'id' del documento 'containerId'
    await containerDocRef.set({ id: location }, { merge: true });

    // Referencia a la colección 'data' y al documento específico 'dateId'
    const dataDocRef = containerDocRef.collection("data").doc(dateId);

    const acceleration: number[] = [x, y, z];

    // Crear o actualizar los campos del documento 'dateId' con los datos de medición
    await dataDocRef.set(
      {
        date: dateId,
        measurements: {
          acceleration,
          distance,
          humidity,
          signal,
          temperature,
        },
      },
      { merge: true }
    );

    res.status(200).send(`Datos actualizados correctamente en Firestore.`);
  } catch (error) {
    console.error("Error al manejar Firestore", error);
    res.status(500).send(error);
  }
});

app.listen(port, localIp, () => {
  console.log(`Server running at http://${localIp}:${port}`);
});

function calculateTemperature(temperaturas: number[]): number {
  const sumaTotal = temperaturas.reduce(
    (suma, temperatura) => suma + temperatura,
    0
  );
  return sumaTotal / temperaturas.length;
}
