import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4";
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ZoneModel, ContainerModel, RecordModel } from "./models/location";
import "./db";
import { ObjectId } from "mongodb";
import gql from 'graphql-tag';

const pubsub = new PubSub();
const SUBSCRIPTION_EVENTS = {
  UPDATED_DATA: "UPDATED_DATA",
  CREATED_DATA: "CREATED_DATA",
};

function getDurationInMilliseconds(duration: String): number {
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

const typeDefs = gql`
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
interface DashboardArgs {
  zoneId: string;
  duration: string;
}
interface DataToFill {
  location: String;
  x: number;
  y: number;
  z: number;
  distance: number;
  humidity: number;
  signal: number;
  temperature: number;
}

const resolvers = {
  Mutation: {
    addData: async (root: any, args: DataToFill) => {
      const { location, x, y, z, distance, humidity, signal, temperature } =
        args;
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

      const newRecord = new RecordModel({
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
      let zone = await ZoneModel.findOne({ idZone: zoneId });

      if (zone) {
        // Zona existe, buscar contenedor
        let container = zone.containers.find(
          (c) => c.idContainer === containerId
        );
        if (container) {
          // Contenedor encontrado, agregar registro
          container.data.push(newRecord);
        } else {
          // Contenedor no encontrado, agregar nuevo contenedor
          const newContainer = new ContainerModel({
            idContainer: containerId,
            data: [newRecord],
          });
          zone.containers.push(newContainer);
        }
        await zone.save();
        pubsub.publish(SUBSCRIPTION_EVENTS.UPDATED_DATA, {
          updatedData: newRecord,
        });
      } else {
        // Zona no existe, crear nueva zona
        zone = new ZoneModel({
          _id: new ObjectId(),
          idZone: zoneId,
          containers: ["azul", "amarillo", "gris", "marron", "verde"].map(
            (color) => ({
              idContainer: color,
              data: color === containerId ? [newRecord] : [],
            })
          ),
        });
        await zone.save();
        pubsub.publish(SUBSCRIPTION_EVENTS.CREATED_DATA, { createdData: zone });
      }
      return newRecord;
    },
  },
  Query: {
    numZones: async () => ZoneModel.collection.countDocuments(),
    allInfo: async () => {
      return ZoneModel.find({});
    },
    zoneIds: async () => {
      const zones = await ZoneModel.find().select("idZone -_id");
      return zones.map((zone) => zone.idZone);
    },
    dashboardStatistics: async (root: any, args: DashboardArgs) => {
      const { zoneId, duration } = args;
      const durationMs = getDurationInMilliseconds(duration);
      const selectedZone = await ZoneModel.findOne({ idZone: zoneId });

      if (!selectedZone) {
        throw new Error("Zone not found");
      }

      const dashboardDataList = [];

      for (const container of selectedZone.containers) {
        const records = [];
        let lastSelectedRecordTime = 0;

        for (const record of container.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )) {
          const recordTime = new Date(record.date).getTime();

          // Verifica si el registro actual cumple con el intervalo de tiempo y limita a 5 registros
          if (
            (lastSelectedRecordTime === 0 ||
              lastSelectedRecordTime - recordTime >= durationMs) &&
            records.length < 5
          ) {
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

    dashboardHTS: async (root: any, args: DashboardArgs) => {
      const { zoneId } = args;
      try {
        // Encuentra la zona específica por su ID
        const zoneDoc = await ZoneModel.findOne({ idZone: zoneId });

        if (!zoneDoc) {
          throw new Error("Zone not found");
        }

        const dashboardData = [];

        for (const container of zoneDoc.containers) {
          // Ordena los datos del contenedor por fecha y obtiene el registro más reciente
          const sortedData = container.data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

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
      } catch (error) {
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

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

(async () => {
  // Creación del servidor Apollo
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  // Iniciar Apollo Server y aplicar middlewares
  await server.start();
  app.use(cors());
  app.use(bodyParser.json());
  app.post('/data', async (req, res) => {
    try {
      // { location: 'Zona1_Azul', x: 100, y: 200, z: 300, distance: 50, humidity: 60, signal: 70, temperature: 25 }
      const data = req.body;
  
      // Preparar los datos para la mutación
      const dataToFill: DataToFill = {
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
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar los datos');
    }
  });
  app.use('/graphql', expressMiddleware(server));

  // Creación del servidor WebSocket para suscripciones
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });

  // Iniciar el servidor HTTP
  httpServer.listen(4000, '192.168.1.132', () => {
    console.log(`🚀 Server is running on http://192.168.1.132:4000/graphql`);
    console.log(`🚀 WebSocket is running on ws://192.168.1.132:4000/graphql`)
  });
})();