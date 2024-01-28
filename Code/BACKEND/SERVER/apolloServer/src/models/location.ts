import mongoose, { Document, Schema } from "mongoose";

// Interfaces para TypeScript
interface IMeasurement extends Document {
  acceleration: number[];
  distance: number;
  temperature: number;
  humidity: number;
  signal: number;
}

interface IRecord extends Document {
  id: string;
  date: string;
  measurements: IMeasurement;
}

interface IContainer extends Document {
  idContainer: string;
  data: IRecord[];
}

interface IZone extends Document {
  _id: string;
  idZone: string;
  coordinates: Number[];
  containers: IContainer[];
}

// Definición del esquema de Measurement
const MeasurementSchema: Schema = new Schema({
  acceleration: { type: [Number], required: true },
  distance: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  signal: { type: Number, required: true },
});

// Definición del esquema de Record
const RecordSchema: Schema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  measurements: { type: MeasurementSchema, required: true },
});

// Definición del esquema de Container
const ContainerSchema: Schema = new Schema({
  idContainer: { type: String, required: true },
  data: [RecordSchema], // Un array de registros
});

// Definición del esquema de Zone
const ZoneSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    idZone: { type: String, required: true },
    containers: { type: [ContainerSchema], required: true },
    coordinates: { type: [Number], required: true },
  },
  { collection: "locations" }
);

// Creación de los modelos
const MeasurementModel = mongoose.model<IMeasurement>(
  "Measurement",
  MeasurementSchema
);
const RecordModel = mongoose.model<IRecord>("Record", RecordSchema);
const ContainerModel = mongoose.model<IContainer>("Container", ContainerSchema);
const ZoneModel = mongoose.model<IZone>("Zone", ZoneSchema);

export { MeasurementModel, RecordModel, ContainerModel, ZoneModel };