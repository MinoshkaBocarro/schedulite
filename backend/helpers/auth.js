const ErrorHandler = require("../../utilities/errorHandler");

// @function isAuthenticated
// Helper authentication function to ensure that only a user with a token indicating they have been authenticated can proceed
// Parameters:
//    context = the context object from the GraphQL resolver argument
function isAuthenticated(context) {
	if (!context.user) {
		// Checks whether the context object contains a value for user and throws an error if it doesn't
		ErrorHandler.throwError(
			// Error details
			"User is not authenticated, no token provided",
			// Error code
			"UNAUTHENTICATED"
		);
	}

	// Returns: Nothing
}

// @function isTheSameUser
// Helper authorisation function to ensure that the user requesting access to user data is the same user
// Parameters:
//    user = the current User document being resolved
//    context = the context object from the GraphQL resolver argument
function isTheSameUser(user, context) {
	// Checks whether the ID in the User document is equal to the ID of the current User from context and throws an error if they don't match
	if (user._id.toString() !== context.user._id.toString()) {
		ErrorHandler.throwError(
			// Error details
			"User is not authorised to perform this action",
			// Code
			"FORBIDDEN",
			// Other options
			{ http: { status: 403 } }
		);
	}
	// Returns: Nothing
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.isTheSameUser = isTheSameUser;
