// Load packages
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

// Load server packages
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// Load merge packages
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { DateTimeTypeDefinition, DateTimeResolver } = require("graphql-scalars");

// Import connection
const { connect } = require("./helpers/connection");

// Configure environmental variables
require("dotenv").config();
const config = require("config");

// Name connection variables
const appPrivateKey = config.get("appPrivateKey");
const dbName = config.get("db.name");
const dbConnectionString = config.get("db.connectionString");

// Check if app private key and connection string are defined
if (!appPrivateKey && dbConnectionString) {
	console.error(
		"FATAL ERROR: APP_PRIVATE_KEY is not defined and/or DB_CONNECTION_String is not defined"
	);
	process.exit(1);
}

// Merge type definitions and resolvers
const typeDefs = loadFilesSync("graphql/*/*-types.js");
const resolvers = loadFilesSync("graphql/*/*-resolvers.js");

const typeDefsMerged = mergeTypeDefs([DateTimeTypeDefinition, ...typeDefs]);
const resolversMerged = mergeResolvers([
	{ DateTime: DateTimeResolver },
	...resolvers,
]);

async function startServer() {
	const server = new ApolloServer({
		typeDefs: typeDefsMerged,
		resolvers: resolversMerged,
	});

	const databaseName = dbName;
	connect(`${dbConnectionString}${databaseName}`);

	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
		context: async ({ req, res }) => {
			try {
				const token = req.headers.authorization || "";
				if (!token) return;

				const user = jwt.verify(token, appPrivateKey);
				if (!user) {
					throw new Error("User not found");
				}
				return { user };
			} catch (error) {
				throw new GraphQLError(error, {
					extensions: {
						code: "JWT_DECODE_ERROR",
					},
				});
			}
		},
	});

	console.log(`Server ready at ${url}`);
}

startServer();
