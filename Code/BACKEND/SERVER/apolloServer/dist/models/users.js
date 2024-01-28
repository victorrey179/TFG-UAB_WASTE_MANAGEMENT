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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = exports.ContainerData = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ContainerDataSchema = new mongoose_1.Schema({
    points: { type: Number, required: true },
    items: { type: Number, required: true },
});
const UserDataSchema = new mongoose_1.Schema({
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
const UserSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    userdata: { type: UserDataSchema, required: true },
}, { collection: "users" });
const ContainerData = mongoose_1.default.model("ContainerData", ContainerDataSchema);
exports.ContainerData = ContainerData;
const UserData = mongoose_1.default.model("UserData", UserDataSchema);
exports.UserData = UserData;
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
