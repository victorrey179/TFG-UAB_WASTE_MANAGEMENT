"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const ws_1 = require("ws");
const schema_1 = require("@graphql-tools/schema");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const location_1 = require("./models/location");
require("./db");
const mongodb_1 = require("mongodb");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const pubsub = new graphql_subscriptions_1.PubSub();
const SUBSCRIPTION_EVENTS = {
    UPDATED_DATA: "UPDATED_DATA",
    CREATED_DATA: "CREATED_DATA",
};
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
const typeDefs = (0, graphql_tag_1.default) `
  type Measurement {
    acceleration: [Int]!
    distance: Int!
    temperature: Int!
    humidity: Int!
    signal: Int!
  }
  type Record {
    id: String!
    date: String!
    measurements: Measurement!
  }
  type Container {
    idContainer: String!
    data: [Record]
  }
  type Zone {
    _id: String!
    idZone: String!
    containers: [Container]!
  }
  type DashboardData {
    containerId: String!
    records: [Record]!
  }
  type DashboardHtsData {
    containerId: String!
    date: String!
    measurements: Measurement!
  }
  type Mutation {
    addData(
      location: String
      x: Int
      y: Int
      z: Int
      distance: Int
      humidity: Int
      signal: Int
      temperature: Int
    ): Record
  }
  type Query {
    numZones: Int!
    allInfo: [Zone]!
    zoneIds: [String]!
    dashboardStatistics(zoneId: String!, duration: String!): [DashboardData]!
    dashboardHTS(zoneId: String!): [DashboardHtsData]!
  }
  type Subscription {
    updatedData: Record!
    createdData: Zone!
  }
`;
const resolvers = {
    Mutation: {
        addData: async (root, args) => {
            const { location, x, y, z, distance, humidity, signal, temperature } = args;
            const [zoneId, containerColor] = location.split("_");
            const containerId = containerColor.toLowerCase();
            const now = new Date();
            // Format the date as 'YYYY-MM-DDThh:mm:ss'
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, add 1
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            // Combine them into the desired format
            const dateId = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Ejemplo: '2023-10-31T12:10:58'
            const newRecord = new location_1.RecordModel({
                id: dateId,
                date: dateId,
                measurements: {
                    acceleration: [x, y, z],
                    distance,
                    humidity,
                    signal,
                    temperature,
                },
            });
            // Buscar si la zona existe
            let zone = await location_1.ZoneModel.findOne({ idZone: zoneId });
            if (zone) {
                // Zona existe, buscar contenedor
                let container = zone.containers.find((c) => c.idContainer === containerId);
                if (container) {
                    // Contenedor encontrado, agregar registro
                    container.data.push(newRecord);
                }
                else {
                    // Contenedor no encontrado, agregar nuevo contenedor
                    const newContainer = new location_1.ContainerModel({
                        idContainer: containerId,
                        data: [newRecord],
                    });
                    zone.containers.push(newContainer);
                }
                await zone.save();
                pubsub.publish(SUBSCRIPTION_EVENTS.UPDATED_DATA, {
                    updatedData: newRecord,
                });
            }
            else {
                // Zona no existe, crear nueva zona
                zone = new location_1.ZoneModel({
                    _id: new mongodb_1.ObjectId(),
                    idZone: zoneId,
                    containers: ["azul", "amarillo", "gris", "marron", "verde"].map((color) => ({
                        idContainer: color,
                        data: color === containerId ? [newRecord] : [],
                    })),
                });
                await zone.save();
                pubsub.publish(SUBSCRIPTION_EVENTS.CREATED_DATA, { createdData: zone });
            }
            return newRecord;
        },
    },
    Query: {
        numZones: async () => location_1.ZoneModel.collection.countDocuments(),
        allInfo: async () => {
            return location_1.ZoneModel.find({});
        },
        zoneIds: async () => {
            const zones = await location_1.ZoneModel.find().select("idZone -_id");
            return zones.map((zone) => zone.idZone);
        },
        dashboardStatistics: async (root, args) => {
            const { zoneId, duration } = args;
            const durationMs = getDurationInMilliseconds(duration);
            const selectedZone = await location_1.ZoneModel.findOne({ idZone: zoneId });
            if (!selectedZone) {
                throw new Error("Zone not found");
            }
            const dashboardDataList = [];
            for (const container of selectedZone.containers) {
                const records = [];
                let lastSelectedRecordTime = 0;
                for (const record of container.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())) {
                    const recordTime = new Date(record.date).getTime();
                    // Verifica si el registro actual cumple con el intervalo de tiempo y limita a 5 registros
                    if ((lastSelectedRecordTime === 0 ||
                        lastSelectedRecordTime - recordTime >= durationMs) &&
                        records.length < 5) {
                        records.push(record);
                        lastSelectedRecordTime = recordTime;
                    }
                }
                if (records.length > 0) {
                    dashboardDataList.push({
                        containerId: container.idContainer,
                        records,
                    });
                }
            }
            return dashboardDataList;
        },
        dashboardHTS: async (root, args) => {
            const { zoneId } = args;
            try {
                // Encuentra la zona específica por su ID
                const zoneDoc = await location_1.ZoneModel.findOne({ idZone: zoneId });
                if (!zoneDoc) {
                    throw new Error("Zone not found");
                }
                const dashboardData = [];
                for (const container of zoneDoc.containers) {
                    // Ordena los datos del contenedor por fecha y obtiene el registro más reciente
                    const sortedData = container.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    const lastRecord = sortedData[0];
                    if (lastRecord) {
                        dashboardData.push({
                            containerId: container.idContainer,
                            date: lastRecord.date,
                            measurements: lastRecord.measurements,
                        });
                    }
                }
                return dashboardData;
            }
            catch (error) {
                console.error("Error al obtener datos de la base de datos", error);
                throw new Error("Server error");
            }
        },
    },
    Subscription: {
        updatedData: {
            subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.UPDATED_DATA]),
        },
        createdData: {
            subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.CREATED_DATA]),
        },
    },
};
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
(async () => {
    // Creación del servidor Apollo
    const server = new server_1.ApolloServer({
        schema,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        ],
    });
    // Iniciar Apollo Server y aplicar middlewares
    await server.start();
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    app.post('/data', async (req, res) => {
        try {
            // { location: 'Zona1_Azul', x: 100, y: 200, z: 300, distance: 50, humidity: 60, signal: 70, temperature: 25 }
            const data = req.body;
            // Preparar los datos para la mutación
            const dataToFill = {
                location: data.location,
                x: data.x,
                y: data.y,
                z: data.z,
                distance: data.distance,
                humidity: data.humidity,
                signal: data.signal,
                temperature: data.temperature
            };
            // Llamar directamente al resolver de la mutación
            const result = await resolvers.Mutation.addData(null, dataToFill);
            // Enviar respuesta de éxito
            res.status(200).json({ message: 'Datos agregados correctamente', record: result });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error al procesar los datos');
        }
    });
    app.use('/graphql', (0, express4_1.expressMiddleware)(server));
    // Creación del servidor WebSocket para suscripciones
    const wsServer = new ws_1.WebSocketServer({ server: httpServer, path: '/graphql' });
    // Iniciar el servidor HTTP
    httpServer.listen(4000, '192.168.1.187', () => {
        console.log(`🚀 Server is running on http://192.168.1.187:4000/graphql`);
        console.log(`🚀 WebSocket is running on ws://192.168.1.187:4000/graphql`);
    });
})();
