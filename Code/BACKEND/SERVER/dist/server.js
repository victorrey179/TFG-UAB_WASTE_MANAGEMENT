"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const admin = __importStar(require("firebase-admin"));
const fbaccount_json_1 = __importDefault(require("./fbaccount.json"));
admin.initializeApp({
    credential: admin.credential.cert(fbaccount_json_1.default),
});
const db = admin.firestore();
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
const localIp = "192.168.1.132";
console.log(`Local IP Address: ${localIp}`);
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});
app.get("/dashboardstatistics/:zoneId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zoneId = req.params.zoneId; // obtenemos el ID de la zona de los parámetros de la ruta
    try {
        // Referencia a la colección 'location' y al documento específico 'zoneId'
        const zoneDocRef = db.collection("location").doc(zoneId);
        // Obtener todos los documentos de la subcolección 'containers'
        const containersSnapshot = yield zoneDocRef.collection("containers").get();
        // Preparar un objeto para almacenar los datos del dashboard
        const dashboardData = [];
        const dashboardStatisticsData = [];
        // Iterar sobre cada documento en 'containers'
        for (const containerDoc of containersSnapshot.docs) {
            const containerName = containerDoc.data().id;
            // Obtener la referencia a la colección 'data' del contenedor actual
            const dataCollectionRef = containerDoc.ref.collection("data");
            // Obtener todos los documentos de la colección 'data'
            const dataSnapshot = yield dataCollectionRef.get();
            // Iterar sobre cada documento en 'data' y agregar los datos al objeto dashboardData
            for (const dataDoc of dataSnapshot.docs) {
                const data = dataDoc.data();
                // Asegúrate de que los datos se ajusten a la estructura de DashboardData
                const dashboardEntry = {
                    containerName: containerName,
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
            const dashboardStatisticsEntry = {
                containerName: containerName,
                statistics: dashboardData,
            };
            dashboardStatisticsData.push(dashboardStatisticsEntry);
        }
        // Enviar los datos recopilados como respuesta
        res.status(200).json(dashboardStatisticsData);
    }
    catch (error) {
        console.error("Error al obtener datos de Firestore", error);
        res.status(500).send("Error al obtener datos del servidor");
    }
}));
app.get("/dashboardhts/:zoneId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zoneId = req.params.zoneId; // obtenemos el ID de la zona de los parámetros de la ruta
    try {
        // Referencia a la colección 'location' y al documento específico 'zoneId'
        const zoneDocRef = db.collection("location").doc(zoneId);
        // Obtener todos los documentos de la subcolección 'containers'
        const containersSnapshot = yield zoneDocRef.collection("containers").get();
        // Preparar un objeto para almacenar los datos del dashboard
        const dashboardData = [];
        // Iterar sobre cada documento en 'containers'
        for (const containerDoc of containersSnapshot.docs) {
            // Aquí asumimos que el nombre del contenedor está almacenado en un campo llamado 'name'
            const containerName = containerDoc.data().id; // o el campo que corresponda
            // Obtener la referencia a la colección 'data' del contenedor actual
            const dataCollectionRef = containerDoc.ref.collection("data");
            // Ordenar los documentos por fecha de manera descendente y limitar a 1 para obtener el más reciente
            const dataSnapshot = yield dataCollectionRef.orderBy("date", "desc").limit(1).get();
            // Si hay un documento, lo agregamos al objeto dashboardData
            if (!dataSnapshot.empty) {
                const dataDoc = dataSnapshot.docs[0]; // obtenemos el documento más reciente
                const data = dataDoc.data();
                // Asegúrate de que los datos se ajusten a la estructura de DashboardData
                const dashboardEntry = {
                    containerName: containerName,
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
    }
    catch (error) {
        console.error("Error al obtener datos de Firestore", error);
        res.status(500).send("Error al obtener datos del servidor");
    }
}));
app.get("/zones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zoneDocRef = db.collection("location");
        const snapshot = yield zoneDocRef.get();
        // Map through documents and get the data
        const zones = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data() // Spread operator to get all fields from the document
        )));
        // Send back an array of zones, each with their id and data
        res.status(200).json(zones);
    }
    catch (error) {
        console.error("Error al obtener datos de Firestore", error);
        res.status(500).send("Error al obtener datos del servidor");
    }
}));
app.post("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, x, y, z, distance, humidity, signal, temperature, } = req.body;
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
        yield containerDocRef.set({ id: location }, { merge: true });
        // Referencia a la colección 'data' y al documento específico 'dateId'
        const dataDocRef = containerDocRef.collection("data").doc(dateId);
        const acceleration = [x, y, z];
        // Crear o actualizar los campos del documento 'dateId' con los datos de medición
        yield dataDocRef.set({
            date: dateId,
            measurements: {
                acceleration,
                distance,
                humidity,
                signal,
                temperature,
            },
        }, { merge: true });
        res.status(200).send(`Datos actualizados correctamente en Firestore.`);
    }
    catch (error) {
        console.error("Error al manejar Firestore", error);
        res.status(500).send(error);
    }
}));
app.listen(port, localIp, () => {
    console.log(`Server running at http://${localIp}:${port}`);
});
function calculateTemperature(temperaturas) {
    const sumaTotal = temperaturas.reduce((suma, temperatura) => suma + temperatura, 0);
    return sumaTotal / temperaturas.length;
}
