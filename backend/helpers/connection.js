const mongoose = require("mongoose");

async function connect(connectionString) {
	try {
		const connectionResult = await mongoose.connect(connectionString);
		if (connectionResult) {
		}
	} catch (error) {
		console.error(`Error connecting to MongoDB`, error);
	}
}

module.exports.connect = connect;
