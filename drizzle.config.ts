import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './src/db/migrations',
	dialect: 'turso',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
