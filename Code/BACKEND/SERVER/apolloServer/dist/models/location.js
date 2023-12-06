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
exports.ZoneModel = exports.ContainerModel = exports.RecordModel = exports.MeasurementModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Definición del esquema de Measurement
const MeasurementSchema = new mongoose_1.Schema({
    acceleration: { type: [Number], required: true },
    distance: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    signal: { type: Number, required: true }
});
// Definición del esquema de Record
const RecordSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    date: { type: String, required: true },
    measurements: { type: MeasurementSchema, required: true }
});
// Definición del esquema de Container
const ContainerSchema = new mongoose_1.Schema({
    idContainer: { type: String, required: true },
    data: [RecordSchema] // Un array de registros
});
// Definición del esquema de Zone
const ZoneSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    idZone: { type: String, required: true },
    containers: { type: [ContainerSchema], required: true }
});
// Creación de los modelos
const MeasurementModel = mongoose_1.default.model('Measurement', MeasurementSchema);
exports.MeasurementModel = MeasurementModel;
const RecordModel = mongoose_1.default.model('Record', RecordSchema);
exports.RecordModel = RecordModel;
const ContainerModel = mongoose_1.default.model('Container', ContainerSchema);
exports.ContainerModel = ContainerModel;
const ZoneModel = mongoose_1.default.model('Zone', ZoneSchema);
exports.ZoneModel = ZoneModel;
