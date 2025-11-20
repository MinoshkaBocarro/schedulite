// Load server packages
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

async function startServer() {
	const server = new ApolloServer();

	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
	});

	console.log(`Server ready at ${url}`);
}

startServer();
