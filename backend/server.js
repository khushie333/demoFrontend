'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = __importDefault(require('mongoose'))
const express_1 = __importDefault(require('express'))
const cors_1 = __importDefault(require('cors'))
//import bodyParser from 'body-parser'
const user_routes_1 = __importDefault(require('./routes/user.routes'))
const authentication_routes_1 = __importDefault(
	require('./routes/authentication.routes')
)
const email_routes_1 = __importDefault(require('./routes/email.routes'))
const connectDB_1 = require('./config/connectDB')
const appConfig = new connectDB_1.AppConfig()
appConfig.initialize()
//const app = express()
const app = (0, express_1.default)()
app.use(express_1.default.json())
//app.use(bodyParser.json()) // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }))
//app.use(express.urlencoded({ extended: true }))
app.use((0, cors_1.default)())
// Or, enable CORS for specific origins
// Replace 'http://localhost:3000' with the origin of your frontend application
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }))
const mongoUrl = appConfig.getMongoUrl()
const serverPort = appConfig.getServerPort()
// Connecting to MongoDB cluster
mongoose_1.default
	.connect(mongoUrl)
	.then(() => {
		console.log('MongoDB connected successfully')
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error)
	})
const port = process.env.PORT || serverPort // Used the serverPort retrieved from the AppConfig
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
app.use('/api', user_routes_1.default)
app.use('/api', authentication_routes_1.default)
// Mount emailRoutes without authenticateUser middleware
app.use('/api', email_routes_1.default)
exports.default = app
