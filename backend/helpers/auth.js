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

// @function isAttending
// Helper authorisation function to ensure that the user requesting access to event data is attending the event
// Parameters:
//    event = the current Event document being resolved
//    context = the context object from the GraphQL resolver argument
function isAttending(event, context) {
	// Filters the array of attendees so that the resulting array only contains the attendee who's username matches the current user's username
	event.attendees.filter((attendee) => {
		context.user.username === attendee.username;
	});

	// Checks there is any entries in the isAttending array which would indicate that the user was matched and throws an error if there isn't as the user is not attending the event
	if (!isAttending.length) {
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

// @function isEventCreator
// Helper authorisation function to ensure that only the creator can proceed
// Parameters:
//    event = the current Event document being resolved
//    context = the context object from the GraphQL resolver argument
async function isEventCreator(event, context) {
	// Checks whether the ID in the current Event document's createdBy field is equal to the ID of the current User from context and throws an error if they don't match
	if (event.createdBy.toString() !== context.user._id.toString()) {
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
module.exports.isAttending = isAttending;
module.exports.isEventCreator = isEventCreator;
