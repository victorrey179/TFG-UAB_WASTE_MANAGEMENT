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
const mongoose_1 = __importStar(require("mongoose"));
// Measurement Schema
const MeasurementSchema = new mongoose_1.Schema({
    acceleration: { type: [Number], required: true },
    distance: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    signal: { type: Number, required: true },
});
// Data Schema
const DataSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    date: { type: Date, required: true },
    measurements: { type: MeasurementSchema, required: true },
});
// Container Schema
const ContainerSchema = new mongoose_1.Schema({
    azul: [DataSchema],
    verde: [DataSchema],
    amarillo: [DataSchema],
    marron: [DataSchema],
    gris: [DataSchema],
});
// Zone Schema
const ZoneSchema = new mongoose_1.Schema({
    ID: { type: ContainerSchema, required: true },
});
// Location Schema
const LocationSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    zones: [ZoneSchema],
});
// Compile model
const Location = mongoose_1.default.model('Location', LocationSchema);
exports.default = Location;
