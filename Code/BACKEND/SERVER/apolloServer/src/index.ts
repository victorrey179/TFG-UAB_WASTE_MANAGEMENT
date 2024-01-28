import express from "express";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
import cors from "cors";
import bodyParser from "body-parser";
import { ZoneModel, ContainerModel, RecordModel } from "./models/location";
import { User, ContainerData, UserData } from "./models/users";
import "./db";
import { ObjectId } from "mongodb";
import gql from "graphql-tag";
import { OpenAI } from "openai";
import { client, CLIENT_ID } from "./auth";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();
const openaiApiKey: string = process.env.OPENAI_API_KEY || '';
const pubsub = new PubSub();

const SUBSCRIPTION_EVENTS = {
  UPDATED_DATA: "UPDATED_DATA",
  CREATED_DATA: "CREATED_DATA",
};

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

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
  type User {
    _id: ID!
    userdata: UserData!
  }

  type UserData {
    name: String!
    surname: String!
    password: String!
    studies: String!
    college: String!
    niu: String!
    totalpoints: Int!
    container_data: ContainerData!
  }

  type ContainerData {
    amarillo: ContainerPoints!
    azul: ContainerPoints!
    verde: ContainerPoints!
    marron: ContainerPoints!
    gris: ContainerPoints!
  }

  type ContainerPoints {
    points: Int!
    items: Int!
  }

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
    coordinates: [Float]!
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
  type PointsToBeCollected {
    zoneId: String!
    coordinates: [Float]!
    containers: [Container]!
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
    addUser(
      name: String!
      surname: String!
      password: String!
      studies: String!
      college: String!
      niu: String!
    ): User!
    modifyUser(
      name: String!
      surname: String!
      password: String!
      studies: String!
      college: String!
      niu: String!
    ): User!
    addPoints(niu: String!, container: String!, items: Int!): User!
  }
  type Query {
    numZones: Int!
    allInfo: [Zone]!
    zoneIds: [String]!
    dashboardStatistics(zoneId: String!, duration: String!): [DashboardData]!
    dashboardHTS(zoneId: String!): [DashboardHtsData]!
    pointsToBeCollected: [PointsToBeCollected]!
    totalPointsUser(niu: String!): Int!
    pointsPerContainer(niu: String!): ContainerData!
    login(niu: String!, password: String!): User
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
    addUser: async (root: any, args: any) => {
      const { name, surname, password, studies, college, niu } = args;
      const newUserdata = new UserData({
        name,
        surname,
        password,
        studies,
        college,
        niu,
        totalpoints: 0,
        container_data: {
          amarillo: { points: 0, items: 0 },
          azul: { points: 0, items: 0 },
          verde: { points: 0, items: 0 },
          marron: { points: 0, items: 0 },
          gris: { points: 0, items: 0 },
        },
      });

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(), // Ensure ObjectId is generated correctly
        userdata: newUserdata,
      });

      await newUser.save();
      return newUser;
    },
    modifyUser: async (root: any, args: any) => {
      const { name, surname, password, studies, college, niu } = args;
      const user = await User.findOne({ "userdata.niu": niu });

      if (user) {
        user.userdata.name = name;
        user.userdata.surname = surname;
        user.userdata.password = password;
        user.userdata.studies = studies;
        user.userdata.college = college;
        user.userdata.niu = niu;
        await user.save();
        return user;
      } else {
        throw new Error("User not found");
      }
    },
    addPoints: async (root: any, args: any) => {
      const { niu, container, items } = args;
      const user = await User.findOne({ "userdata.niu": niu });
      const points = () => {
        if (container === "amarillo") {
          return items * 20;
        } else if (container === "azul") {
          return items * 15;
        } else if (container === "verde") {
          return items * 30;
        } else if (container === "marron") {
          return items * 25;
        } else if (container === "gris") {
          return items * 10;
        }
      };
      if (user) {
        const pointsToAdd = points();
        user.userdata.totalpoints += pointsToAdd!;
        user.userdata.container_data[
          container as keyof typeof user.userdata.container_data
        ].points += pointsToAdd!;
        user.userdata.container_data[
          container as keyof typeof user.userdata.container_data
        ].items += items;
        await user.save();
        return user;
      } else {
        throw new Error("User not found");
      }
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
    pointsToBeCollected: async () => {
      const zones = await ZoneModel.find().select("idZone -_id");
      const zoneIds = zones.map((zone) => zone.idZone);
      try {
        // Si zoneIds está vacío, devuelve un arreglo vacío
        if (!zoneIds || zoneIds.length === 0) {
          return [];
        }

        // Encuentra todas las zonas correspondientes a los IDs proporcionados
        const zones = await ZoneModel.find({ idZone: { $in: zoneIds } });

        const pointsToBeCollected = zones.map((zone) => {
          const containersToBeCollected = zone.containers.filter(
            (container) => {
              // Encuentra el último registro para cada contenedor
              const lastRecord = container.data.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0];

              // Verifica si la última 'distance' registrada es menor a 50 cm
              return lastRecord && lastRecord.measurements.distance < 50;
            }
          );

          return {
            zoneId: zone.idZone,
            containers: containersToBeCollected,
            coordinates: zone.coordinates,
          };
        });

        return pointsToBeCollected;
      } catch (error) {
        console.error("Error al obtener los puntos a recolectar", error);
        throw new Error("Server error");
      }
    },
    totalPointsUser: async (root: any, args: any) => {
      try {
        const { niu } = args;
        const user = await User.findOne({ "userdata.niu": niu }).select(
          "userdata.totalpoints -_id"
        );

        if (!user) {
          return 0; // or return 0, depending on your schema requirements
        }

        return user.userdata.totalpoints;
      } catch (error) {
        console.error("Error fetching total points:", error);
        throw new Error("Error fetching total points for user");
      }
    },
    pointsPerContainer: async (root: any, args: any) => {
      const { niu } = args;

      const user = await User.findOne({ "userdata.niu": niu }).select(
        "userdata.container_data -_id"
      );
      if (!user) {
        return [];
      }
      return user.userdata.container_data;
    },
    login: async (root: any, args: { niu: string; password: string }) => {
      const { niu, password } = args;
      try {
        const user = await User.findOne({ "userdata.niu": niu });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = password === user.userdata.password;
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        return user;
      } catch (error) {
        console.error("Login error:", error);
        // Lanzar el error original para obtener más detalles
        throw error;
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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Iniciar Apollo Server y aplicar middlewares
  await server.start();
  app.use(cors());
  app.use(bodyParser.json());
  app.get("/visionGpt", async (req, res) => {
    const { image } = req.body;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Give me a description about this object, give me the material or materials which is made from 100% sure to 50% sure in a json format",
              },
              {
                type: "image_url",
                image_url: {
                  url: "data:image/jpeg;base64," + image,
                  detail: "low",
                },
              },
            ],
          },
        ],
      });
      console.log(response.choices[0]);
      res.send("WorkingOn");
    } catch (error) {
      console.error("Error:", error);
      res.send(error);
    }
  });
  app.post("/data", async (req, res) => {
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
        temperature: data.temperature,
      };

      // Llamar directamente al resolver de la mutación
      const result = await resolvers.Mutation.addData(null, dataToFill);

      // Enviar respuesta de éxito
      res
        .status(200)
        .json({ message: "Datos agregados correctamente", record: result });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al procesar los datos");
    }
  });
  app.use("/graphql", expressMiddleware(server));

  // Creación del servidor WebSocket para suscripciones
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Iniciar el servidor HTTP
  httpServer.listen(4000, "192.168.1.33", () => {
    console.log(`🚀 Server is running on http://192.168.1.33:4000/graphql`);
    console.log(`🚀 WebSocket is running on ws://192.168.1.33:4000/graphql`);
  });
})();
