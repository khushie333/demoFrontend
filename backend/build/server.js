"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//import multer from 'multer'
//import bodyParser from 'body-parser'
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const bid_routes_1 = __importDefault(require("./routes/bid.routes"));
const errorHandling_middleware_1 = require("./middlewares/errorHandling.middleware");
const connectDB_1 = require("./config/connectDB");
const appConfig = new connectDB_1.AppConfig();
appConfig.initialize();
//const app = express()
const app = (0, express_1.default)();
app.use(express_1.default.json());
//app.use(bodyParser.json()) // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
//app.use(express.urlencoded({ extended: true }))
app.use((0, cors_1.default)());
app.use(express_1.default.static('uploads'));
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
const mongoUrl = appConfig.getMongoUrl();
const serverPort = appConfig.getServerPort();
// Connecting to MongoDB cluster
mongoose_1.default
    .connect(mongoUrl)
    .then(() => {
    console.log('MongoDB connected successfully!!!');
})
    .catch((error) => {
    console.error('oops,Error connecting to MongoDB:', error);
});
const port = process.env.PORT || serverPort;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/api', user_routes_1.default);
app.use('/api', authentication_routes_1.default);
app.use('/api', email_routes_1.default);
app.use('/api', car_routes_1.default);
app.use('/api', bid_routes_1.default);
app.use(errorHandling_middleware_1.errorHandler);
app.use(errorHandling_middleware_1.handleError);
exports.default = app;
