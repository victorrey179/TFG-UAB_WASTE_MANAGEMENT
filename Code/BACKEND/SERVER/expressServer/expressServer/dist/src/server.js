"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const cors_1 = __importDefault(require("cors"));
require("../DB/db");
const locations_1 = __importDefault(require("../DB/models/locations"));
const app = (0, express_1.default)();
const port = 3050;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
function getLocalIp() {
    const interfaces = os_1.default.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "0.0.0.0";
}
//const localIp = getLocalIp();
const localIp = "localhost";
console.log(`Local IP Address: ${localIp}`);
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});
function getDurationInMilliseconds(duration) {
    const match = duration.match(/^(\d+)(min|h|d|sem|mes)$/);
    if (!match)
        throw new Error("Invalid duration format");
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
app.get("/dashboardstatistics/:zoneId/:duration", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { zoneId, duration } = req.params;
    // Convertir duration a milisegundos para el cálculo
    const durationMs = getDurationInMilliseconds(duration);
    try {
        // Encuentra el documento de la zona en MongoDB
        const zoneDoc = yield locations_1.default.find({}).findOne({ "zones.ID": zoneId });
        if (!zoneDoc) {
            return res.status(404).send('Zona no encontrada');
        }
        // const dashboardStatisticsData = [];
        // for (const color in zoneDoc.Z1) {
        //   const containers = zoneDoc.Z1[color];
        //   for (const container of containers) {
        //     const containerName = container.id;
        //     const dataEntries = container.measurements; // Ajusta según tu esquema
        //     const filteredData = [];
        //     let previousTimestamp = 0;
        //     for (const data of dataEntries) {
        //       const currentTimestamp = new Date(data.date).getTime();
        //       if (previousTimestamp === 0 || currentTimestamp - previousTimestamp >= durationMs) {
        //         filteredData.push(data);
        //         previousTimestamp = currentTimestamp;
        //       }
        //     }
        //     // Asegúrate de que filteredData contenga solo los últimos 5 registros
        //     const lastFiveData = filteredData.slice(-5);
        //     if (lastFiveData.length > 0) {
        //       dashboardStatisticsData.push({
        //         containerName,
        //         statistics: lastFiveData,
        //       });
        //     }
        //   }
        // }
        res.status(200).json(zoneDoc);
    }
    catch (error) {
        console.error("Error fetching data from MongoDB", error);
        res.status(500).send("Server error");
    }
}));
// app.get("/dashboardstatistics/:zoneId/:duration", async (req, res) => {
//   const { zoneId, duration } = req.params;
//   // Convert duration to milliseconds for calculation
//   const durationMs = getDurationInMilliseconds(duration);
//   try {
//     const zoneDocRef = db.collection("location").doc(zoneId);
//     const containersSnapshot = await zoneDocRef.collection("containers").get();
//     const dashboardStatisticsData: DashboardDataStatistics[] = [];
//     for (const containerDoc of containersSnapshot.docs) {
//       const containerName = containerDoc.data().id;
//       const dataCollectionRef = containerDoc.ref.collection("data");
//       const dataSnapshot = await dataCollectionRef.get();
//       const filteredData: DashboardData[] = [];
//       let previousTimestamp = 0;
//       for (const dataDoc of dataSnapshot.docs) {
//         const data = dataDoc.data() as DashboardData;
//         const currentTimestamp = new Date(data.date).getTime();
//         if (
//           previousTimestamp === 0 ||
//           currentTimestamp - previousTimestamp >= durationMs
//         ) {
//           filteredData.push(data);
//           previousTimestamp = currentTimestamp;
//         }
//       }
//       // Asegúrate de que filteredData contenga solo los últimos 5 registros
//       const lastFiveData = filteredData.slice(-5);
//       if (lastFiveData.length > 0) {
//         dashboardStatisticsData.push({
//           containerName,
//           statistics: lastFiveData,
//         });
//       }
//     }
//     res.status(200).json(dashboardStatisticsData);
//   } catch (error) {
//     console.error("Error fetching data from Firestore", error);
//     res.status(500).send("Server error");
//   }
// });
app.get("/dashboardhts/:zoneId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zoneId = req.params.zoneId; // obtenemos el ID de la zona de los parámetros de la ruta
    // try {
    //   // Referencia a la colección 'location' y al documento específico 'zoneId'
    //   const zoneDocRef = db.collection("location").doc(zoneId);
    //   // Obtener todos los documentos de la subcolección 'containers'
    //   const containersSnapshot = await zoneDocRef.collection("containers").get();
    //   // Preparar un objeto para almacenar los datos del dashboard
    //   const dashboardData: DashboardData[] = [];
    //   // Iterar sobre cada documento en 'containers'
    //   for (const containerDoc of containersSnapshot.docs) {
    //     // Aquí asumimos que el nombre del contenedor está almacenado en un campo llamado 'name'
    //     const containerName = containerDoc.data().id; // o el campo que corresponda
    //     // Obtener la referencia a la colección 'data' del contenedor actual
    //     const dataCollectionRef = containerDoc.ref.collection("data");
    //     // Ordenar los documentos por fecha de manera descendente y limitar a 1 para obtener el más reciente
    //     const dataSnapshot = await dataCollectionRef
    //       .orderBy("date", "desc")
    //       .limit(1)
    //       .get();
    //     // Si hay un documento, lo agregamos al objeto dashboardData
    //     if (!dataSnapshot.empty) {
    //       const dataDoc = dataSnapshot.docs[0]; // obtenemos el documento más reciente
    //       const data = dataDoc.data();
    //       // Asegúrate de que los datos se ajusten a la estructura de DashboardData
    //       const dashboardEntry: DashboardData = {
    //         containerName: containerName, // Añadimos el nombre del contenedor
    //         date: data.date,
    //         measurements: {
    //           acceleration: data.measurements.acceleration,
    //           distance: data.measurements.distance,
    //           humidity: data.measurements.humidity,
    //           signal: data.measurements.signal,
    //           temperature: data.measurements.temperature,
    //         },
    //       };
    //       dashboardData.push(dashboardEntry);
    //     }
    //   }
    //   // Enviar los datos recopilados como respuesta
    //   res.status(200).json(dashboardData);
    // } catch (error) {
    //   console.error("Error al obtener datos de Firestore", error);
    //   res.status(500).send("Error al obtener datos del servidor");
    // }
}));
app.get("/zones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const zoneDocRef = db.collection("location");
    //   const snapshot = await zoneDocRef.get();
    //   // Map through documents and get the data
    //   const zones = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(), // Spread operator to get all fields from the document
    //   }));
    //   // Guardar los datos en un archivo
    //   const fs = require("fs");
    //   fs.writeFileSync("zonesData.json", JSON.stringify(zones, null, 2));
    //   // Send back an array of zones, each with their id and data
    //   res.status(200).json(zones);
    // } catch (error) {
    //   console.error("Error al obtener datos de Firestore", error);
    //   res.status(500).send("Error al obtener datos del servidor");
    // }
}));
app.get("/mongo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield locations_1.default.find({});
        console.log(locations);
        // Send back an array of zones, each with their id and data
        res.status(200).json(locations);
    }
    catch (error) { }
}));
app.post("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {
    //   location,
    //   x,
    //   y,
    //   z,
    //   distance,
    //   humidity,
    //   signal,
    //   temperature,
    // }: DataPayload = req.body;
    // // Dividir la ubicación para obtener los identificadores de los documentos
    // const [zone, , containerColor] = location.split("_");
    // const zoneId = zone; // Ejemplo: 'Z1'
    // const containerId = containerColor.toLowerCase(); // Ejemplo: 'azul'
    // // Create a new Date object for the current time
    // const now = new Date();
    // // Format the date as 'YYYY-MM-DDThh:mm:ss'
    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, add 1
    // const day = String(now.getDate()).padStart(2, "0");
    // const hours = String(now.getHours()).padStart(2, "0");
    // const minutes = String(now.getMinutes()).padStart(2, "0");
    // const seconds = String(now.getSeconds()).padStart(2, "0");
    // // Combine them into the desired format
    // const dateId = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Ejemplo: '2023-10-31T12:10:58'
    // try {
    //   // Referencia a la colección 'location' y al documento específico 'zoneId'
    //   const zoneDocRef = db.collection("location").doc(zoneId);
    //   // Referencia a la subcolección 'containers' y al documento específico 'containerId'
    //   const containerDocRef = zoneDocRef
    //     .collection("containers")
    //     .doc(containerId);
    //   // Actualizar el campo 'id' del documento 'containerId'
    //   await containerDocRef.set({ id: location }, { merge: true });
    //   // Referencia a la colección 'data' y al documento específico 'dateId'
    //   const dataDocRef = containerDocRef.collection("data").doc(dateId);
    //   const acceleration: number[] = [x, y, z];
    //   // Crear o actualizar los campos del documento 'dateId' con los datos de medición
    //   await dataDocRef.set(
    //     {
    //       date: dateId,
    //       measurements: {
    //         acceleration,
    //         distance,
    //         humidity,
    //         signal,
    //         temperature,
    //       },
    //     },
    //     { merge: true }
    //   );
    //   res.status(200).send(`Datos actualizados correctamente en Firestore.`);
    // } catch (error) {
    //   console.error("Error al manejar Firestore", error);
    //   res.status(500).send(error);
    // }
}));
app.listen(port, localIp, () => {
    console.log(`Server running at http://${localIp}:${port}`);
});
function calculateTemperature(temperaturas) {
    const sumaTotal = temperaturas.reduce((suma, temperatura) => suma + temperatura, 0);
    return sumaTotal / temperaturas.length;
}
app.get("/getdata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const containerNames = ["azul", "amarillo", "gris", "marron", "verde"];
    // try {
    //   const zonesCollectionRef = db.collection("location");
    //   // Obtener todas las zonas
    //   const zonesSnapshot = await zonesCollectionRef.get();
    //   // Preparar un objeto para almacenar los datos de todos los contenedores de todas las zonas
    //   const allZonesData: Record<string, any> = {};
    //   for (const zoneDoc of zonesSnapshot.docs) {
    //     const zoneId = zoneDoc.id;
    //     const zoneDocRef = zonesCollectionRef.doc(zoneId);
    //     const zoneData: Record<string, any[]> = {};
    //     for (const containerName of containerNames) {
    //       const containerDocRef = zoneDocRef
    //         .collection("containers")
    //         .doc(containerName);
    //       const dataCollectionRef = containerDocRef.collection("data");
    //       const dataSnapshot = await dataCollectionRef.get();
    //       zoneData[containerName] = dataSnapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //       }));
    //     }
    //     allZonesData[zoneId] = zoneData;
    //   }
    //   res.status(200).json(allZonesData);
    // } catch (error) {
    //   console.error("Error al obtener datos de Firestore", error);
    //   res.status(500).send("Error al obtener datos del servidor");
    // }
}));
