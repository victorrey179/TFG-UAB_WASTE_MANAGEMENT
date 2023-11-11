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
const localIp = "192.168.1.132";
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

interface Measurement {
  acceleration: number[];
  distance: number;
  humidity: number;
  signal: number;
  temperature: number;
}

interface DashboardData {
  containerName: string;
  date: string;
  measurements: Measurement;
}

interface DashboardDataStatistics {
  containerName: string;
  statistics: DashboardData[];
}


function getDurationInMilliseconds(duration: string): number {
  const match = duration.match(/^(\d+)(min|h|d|sem|mes)$/);
  if (!match) throw new Error("Invalid duration format");

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "min":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "sem":
      return value * 7 * 24 * 60 * 60 * 1000;
    case "mes":
      return value * 30 * 24 * 60 * 60 * 1000; // Approximate month duration
    default:
      throw new Error("Invalid duration unit");
  }
}

app.get("/dashboardstatistics/:zoneId/:duration", async (req, res) => {
  const { zoneId, duration } = req.params;

  // Convert duration to milliseconds for calculation
  const durationMs = getDurationInMilliseconds(duration);

  try {
    const zoneDocRef = db.collection("location").doc(zoneId);
    const containersSnapshot = await zoneDocRef.collection("containers").get();

    const dashboardStatisticsData: DashboardDataStatistics[] = [];

    for (const containerDoc of containersSnapshot.docs) {
      const containerName = containerDoc.data().id;
      const dataCollectionRef = containerDoc.ref.collection("data");
      const dataSnapshot = await dataCollectionRef.get();

      const filteredData: DashboardData[] = [];
      let previousTimestamp = 0;

      for (const dataDoc of dataSnapshot.docs) {
        const data = dataDoc.data() as DashboardData;
        const currentTimestamp = new Date(data.date).getTime();

        if (previousTimestamp === 0 || currentTimestamp - previousTimestamp >= durationMs) {
          filteredData.push(data);
          previousTimestamp = currentTimestamp;
        }
      }

      // Asegúrate de que filteredData contenga solo los últimos 5 registros
      const lastFiveData = filteredData.slice(-5);

      if (lastFiveData.length > 0) {
        dashboardStatisticsData.push({
          containerName,
          statistics: lastFiveData,
        });
      }
    }

    res.status(200).json(dashboardStatisticsData);
  } catch (error) {
    console.error("Error fetching data from Firestore", error);
    res.status(500).send("Server error");
  }
});

app.get("/dashboardhts/:zoneId", async (req, res) => {
  const zoneId = req.params.zoneId; // obtenemos el ID de la zona de los parámetros de la ruta

  try {
    // Referencia a la colección 'location' y al documento específico 'zoneId'
    const zoneDocRef = db.collection("location").doc(zoneId);

    // Obtener todos los documentos de la subcolección 'containers'
    const containersSnapshot = await zoneDocRef.collection("containers").get();

    // Preparar un objeto para almacenar los datos del dashboard
    const dashboardData: DashboardData[] = [];

    // Iterar sobre cada documento en 'containers'
    for (const containerDoc of containersSnapshot.docs) {
      // Aquí asumimos que el nombre del contenedor está almacenado en un campo llamado 'name'
      const containerName = containerDoc.data().id; // o el campo que corresponda

      // Obtener la referencia a la colección 'data' del contenedor actual
      const dataCollectionRef = containerDoc.ref.collection("data");

      // Ordenar los documentos por fecha de manera descendente y limitar a 1 para obtener el más reciente
      const dataSnapshot = await dataCollectionRef.orderBy("date", "desc").limit(1).get();

      // Si hay un documento, lo agregamos al objeto dashboardData
      if (!dataSnapshot.empty) {
        const dataDoc = dataSnapshot.docs[0]; // obtenemos el documento más reciente
        const data = dataDoc.data();
        // Asegúrate de que los datos se ajusten a la estructura de DashboardData
        const dashboardEntry: DashboardData = {
          containerName: containerName, // Añadimos el nombre del contenedor
          date: data.date,
          measurements: {
            acceleration: data.measurements.acceleration,
            distance: data.measurements.distance,
            humidity: data.measurements.humidity,
            signal: data.measurements.signal,
            temperature: data.measurements.temperature,
          }
        };
        dashboardData.push(dashboardEntry);
      }
    }

    // Enviar los datos recopilados como respuesta
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error al obtener datos de Firestore", error);
    res.status(500).send("Error al obtener datos del servidor");
  }
});

app.get("/zones", async (req, res) => {
  try {
    const zoneDocRef = db.collection("location");
    const snapshot = await zoneDocRef.get();
    
    // Map through documents and get the data
    const zones = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() // Spread operator to get all fields from the document
    }));
    
    // Send back an array of zones, each with their id and data
    res.status(200).json(zones);
  } catch (error) {
    console.error("Error al obtener datos de Firestore", error);
    res.status(500).send("Error al obtener datos del servidor");
  }
});



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
  // Create a new Date object for the current time
  const now = new Date();

  // Format the date as 'YYYY-MM-DDThh:mm:ss'
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, add 1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Combine them into the desired format
  const dateId = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Ejemplo: '2023-10-31T12:10:58'

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
