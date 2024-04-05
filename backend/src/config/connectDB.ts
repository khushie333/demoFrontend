import dotenv from 'dotenv'

dotenv.config()

interface ProcessEnv {
	[key: string]: string | undefined
}

declare const process: {
	env: ProcessEnv
}

export class AppConfig {
	private mongoUrl: string
	private serverPort: number
	private databaseName: string

	constructor() {
		this.mongoUrl = ''
		this.serverPort = 5000 // Default port
		this.databaseName = '' // Initialize database name
	}

	initialize(): void {
		const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || ''
		const MONGO_URL = process.env.url || ''
		const DATABASE_NAME = process.env.DATABASE_NAME || ''
		const PORT = process.env.PORT || '5000'

		this.mongoUrl = `${MONGO_URL}/${DATABASE_NAME}` // Concatenate MONGO_URL and DATABASE_NAME
		this.serverPort = Number(PORT)
		this.databaseName = DATABASE_NAME
	}

	getMongoUrl(): string {
		return this.mongoUrl
	}

	getServerPort(): number {
		return this.serverPort
	}

	getDatabaseName(): string {
		return this.databaseName
	}
}
