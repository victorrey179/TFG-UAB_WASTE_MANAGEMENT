import mongoose, { Document, Schema } from "mongoose";

interface IContainerData {
  points: number;
  items: number;
}

interface IUserData {
  name: string;
  surname: string;
  password: string;
  studies: string;
  college: string;
  niu: string;
  totalpoints: number;
  container_data: {
    amarillo: IContainerData;
    azul: IContainerData;
    verde: IContainerData;
    marron: IContainerData;
    gris: IContainerData;
  };
}

interface IUser {
  _id: string;
  userdata: IUserData;
}

interface IUserDocument extends IUserData, Document {}

const ContainerDataSchema = new Schema<IContainerData>({
  points: { type: Number, required: true },
  items: { type: Number, required: true },
});

const UserDataSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  studies: { type: String, required: true },
  college: { type: String, required: true },
  niu: { type: String, required: true },
  totalpoints: { type: Number, required: true },
  container_data: {
    amarillo: { type: ContainerDataSchema, required: true },
    azul: { type: ContainerDataSchema, required: true },
    verde: { type: ContainerDataSchema, required: true },
    marron: { type: ContainerDataSchema, required: true },
    gris: { type: ContainerDataSchema, required: true },
  },
});

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    userdata: { type: UserDataSchema, required: true },
  },
  { collection: "users" }
);

const ContainerData = mongoose.model("ContainerData", ContainerDataSchema);
const UserData = mongoose.model<IUserDocument>("UserData", UserDataSchema);
const User = mongoose.model("User", UserSchema);

export { User, ContainerData, UserData };
