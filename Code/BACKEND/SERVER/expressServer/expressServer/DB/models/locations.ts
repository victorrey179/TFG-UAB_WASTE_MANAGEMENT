import mongoose, { Document, Schema } from 'mongoose';

// interface IMeasurement {
//   acceleration: number[];
//   distance: number;
//   temperature: number;
//   humidity: number;
//   signal: number;
// }

// interface IData extends Document {
//   id: string;
//   date: Date;
//   measurements: IMeasurement;
// }

// interface IContainer {
//   azul: IData[];
//   amarillo: IData[];
//   gris: IData[];
//   marron: IData[];
//   verde: IData[];
// }

// interface IZone extends Document {
//   name: string;
//   containers: IContainer;
// }

// interface ILocation extends Document {
//   zones: IZone[];
// }

// const MeasurementSchema: Schema = new Schema<IMeasurement>({
//   acceleration: { type: [Number], required: true },
//   distance: { type: Number, required: true },
//   temperature: { type: Number, required: true },
//   humidity: { type: Number, required: true },
//   signal: { type: Number, required: true }
// });

// const DataSchema: Schema = new Schema<IData>({
//   id: { type: String, required: true },
//   date: { type: Date, required: true },
//   measurements: MeasurementSchema
// });

// const ContainerSchema: Schema = new Schema<IContainer>({
//   azul: [DataSchema],
//   amarillo: [DataSchema],
//   gris: [DataSchema],
//   marron: [DataSchema],
//   verde: [DataSchema]
// });

// const ZoneSchema: Schema = new Schema<IZone>({
//   name: { type: String, required: true },
//   containers: ContainerSchema
// });

// const LocationSchema: Schema = new Schema<ILocation>({
//   zones: [ZoneSchema]
// });

// export default mongoose.model<ILocation>('Location', LocationSchema);

// Measurement Interface
interface IMeasurement {
  acceleration: number[];
  distance: number;
  temperature: number;
  humidity: number;
  signal: number;
}

// Data Interface for each entry in a container
interface IData extends Document {
  id: string;
  date: Date;
  measurements: IMeasurement;
}

// Container Interface
interface IContainer extends Document {
  azul: IData[];
  verde: IData[];
  amarillo: IData[];
  marron: IData[];
  gris: IData[];
}

// Zone Interface
interface IZone extends Document {
  ID: IContainer;
  // Add other zones like Z2, Z3, etc., as needed
}

// Location Interface
interface ILocation extends Document {
  _id: Schema.Types.ObjectId;
  zones: IZone[];
}

// Measurement Schema
const MeasurementSchema: Schema = new Schema<IMeasurement>({
  acceleration: { type: [Number], required: true },
  distance: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  signal: { type: Number, required: true },
});

// Data Schema
const DataSchema: Schema = new Schema<IData>({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  measurements: { type: MeasurementSchema, required: true },
});

// Container Schema
const ContainerSchema: Schema = new Schema<IContainer>({
  azul: [DataSchema],
  verde: [DataSchema],
  amarillo: [DataSchema],
  marron: [DataSchema],
  gris: [DataSchema],
});

// Zone Schema
const ZoneSchema: Schema = new Schema<IZone>({
  ID: { type: ContainerSchema, required: true },
});

// Location Schema
const LocationSchema: Schema = new Schema<ILocation>({
  _id: Schema.Types.ObjectId,
  zones: [ZoneSchema],
});

// Compile model
const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location;