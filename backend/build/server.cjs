"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB_1 = require("./config/connectDB");
// Instantiate AppConfig and initialize
const appConfig = new connectDB_1.AppConfig();
appConfig.initialize();
// Access MongoDB URL and server port
const mongoUrl = appConfig.getMongoUrl();
const serverPort = appConfig.getServerPort(); // Added
// Connect to MongoDB cluster
mongoose_1.default
    .connect(mongoUrl) // Use new connection options
    .then(() => {
    console.log('MongoDB connected successfully');
    // Start your server or perform any other operations here
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Example: Start a server
// const express = require('express');
// const app = express();
// app.listen(serverPort, () => {
//     console.log(`Server is running on port ${serverPort}`);
// });
