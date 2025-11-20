const { GraphQLError } = require("graphql");

function catchError(error, message, code) {
	// Check if error is a GraphQLError
	if (error instanceof GraphQLError) {
		throw error;
	}

	// Otherwise, it's an unexpected internal error
	throw new GraphQLError(message, { extensions: { code: code } });
}

function throwError(message, code, options) {
	const mergedOptions = { code: code, ...options };
	throw new GraphQLError(message, { extensions: mergedOptions });
}

const ErrorHandler = {
	catchError,
	throwError,
};

module.exports = ErrorHandler;
