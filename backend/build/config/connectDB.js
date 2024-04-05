"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AppConfig {
    constructor() {
        this.mongoUrl = '';
        this.serverPort = 5000; // Default port
        this.databaseName = ''; // Initialize database name
    }
    initialize() {
        const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || '';
        const MONGO_URL = process.env.url || '';
        const DATABASE_NAME = process.env.DATABASE_NAME || '';
        const PORT = process.env.PORT || '5000';
        this.mongoUrl = `${MONGO_URL}/${DATABASE_NAME}`; // Concatenate MONGO_URL and DATABASE_NAME
        this.serverPort = Number(PORT);
        this.databaseName = DATABASE_NAME;
    }
    getMongoUrl() {
        return this.mongoUrl;
    }
    getServerPort() {
        return this.serverPort;
    }
    getDatabaseName() {
        return this.databaseName;
    }
}
exports.AppConfig = AppConfig;
