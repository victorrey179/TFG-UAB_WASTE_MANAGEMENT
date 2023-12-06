import { ApolloServer, gql } from "apollo-server";
import bluecampusdb from "./bluecampusDB";
import "./db";

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
  type Query {
    numZones: Int!
    allInfo: [Zone]!
    zoneIds: [String]!
    dashboardStatistics(zoneId: String!, duration: String!): [DashboardData]!
    dashboardHTS(zoneId: String!): [DashboardHtsData]!
  }
`;
interface DashboardArgs {
  zoneId: string;
  duration: string;
}

const resolvers = {
  Query: {
    numZones: async () => bluecampusdb.length,
    allInfo: async () => bluecampusdb,
    zoneIds: async () => bluecampusdb.map((zone) => zone.idZone),
    dashboardStatistics: async (root: any, args: DashboardArgs) => {
      const { zoneId, duration } = args;
      const durationMs = getDurationInMilliseconds(duration);
      const selectedZone = bluecampusdb.find((zone) => zone.idZone === zoneId);
    
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
          if ((lastSelectedRecordTime === 0 || (lastSelectedRecordTime - recordTime) >= durationMs) && records.length < 5) {
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
        const zoneDoc = bluecampusdb.find((zone) => zone.idZone === zoneId);

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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
