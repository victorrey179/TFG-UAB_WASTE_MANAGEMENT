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
    credential: admin.credential.cert(fbaccount_json_1.default)
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
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
}
//const localIp = getLocalIp();
const localIp = "192.168.1.161";
console.log(`Local IP Address: ${localIp}`);
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});
app.post('/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, x, y, z, distance, humidity, signal, temperature } = req.body;
    // Dividir la ubicación para obtener los identificadores de los documentos
    const [zone, , containerColor] = location.split('_');
    const zoneId = zone; // Ejemplo: 'Z1'
    const containerId = containerColor.toLowerCase(); // Ejemplo: 'azul'
    const dateId = Date.now.toString(); // Ejemplo: '2023-10-31'
    try {
        // Referencia a la colección 'location' y al documento específico 'zoneId'
        const zoneDocRef = db.collection('location').doc(zoneId);
        // Referencia a la subcolección 'containers' y al documento específico 'containerId'
        const containerDocRef = zoneDocRef.collection('containers').doc(containerId);
        // Actualizar el campo 'id' del documento 'containerId'
        yield containerDocRef.set({ id: location }, { merge: true });
        // Referencia a la colección 'data' y al documento específico 'dateId'
        const dataDocRef = containerDocRef.collection('data').doc(dateId);
        const acceleration = [x, y, z];
        // Crear o actualizar los campos del documento 'dateId' con los datos de medición
        yield dataDocRef.set({
            date: dateId,
            measurements: {
                acceleration,
                distance,
                humidity,
                signal,
                temperature
            }
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
