// Error Handler Imports
const ErrorHandler = require("../../../utilities/errorHandler");

// Auth Imports
const { isAuthenticated, isAttending } = require("../../helpers/auth");

// Mongoose Model Imports
const {
	Event,
	validateEvent,
	validateEventUpdate,
} = require("../../models/event");
const { User } = require("../../models/user");

const resolvers = {
	Event: {
		createdBy: async (parent) => {
			const creator = await User.findById(parent.createdBy);
			return creator;
		},
		attendees: async (parent) => {
			const attendees = await User.find({
				_id: { $in: parent.attendees },
			});
			return attendees;
		},
	},

	Query: {
		getEvent: async (parent, args, context) => {
			try {
				isAuthenticated(context);

				const event = await Event.findById(args.id);

				if (!event) {
					ErrorHandler.throwError(
						"Event does not exist",
						"GET_EVENT_ERROR"
					);
				}

				// Checks if the user has been authorised to access the event by checking if they're on the attendee list
				isAttending(event, context);

				return event;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch event: ${error.message}`,
					"FETCH_EVENT_ERROR"
				);
			}
		},

		getUsersEvents: async (parent, args, context) => {
			try {
				isAuthenticated(context);

				const userID = context.user._id;

				const events = await Event.find({ attendees: userID });

				if (!events.length) {
					return [];
				}

				return events;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch events ${error.message}`,
					"FETCH_EVENTS_ERROR"
				);
			}
		},
	},

	Mutation: {
		createEvent: async (parent, args, context) => {
			try {
				isAuthenticated(context);

				const creatorID = context.user._id;
				const creatorUsername = context.user.username;

				const { attendees, ...inputData } = args.input;

				const finalAttendees = await processCreatorInUsernameList(
					creatorID,
					creatorUsername,
					attendees
				);

				const eventData = {
					...inputData,
					createdBy: creatorID,
					attendees: finalAttendees,
				};

				const { error, value } = validateEvent(eventData);

				if (error) {
					ErrorHandler.throwError(
						`Invalid input data: ${error.message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				const event = new Event(value);
				await event.save();

				return event;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to create event ${error.message}`,
					"CREATE_EVENT_ERROR"
				);
			}
		},
	},
};

// @function usernameListValidation
// Helper function to validate a list of usernames to ensure they exist in the database and retrieve their MongoDB IDs
// Parameter: givenUsernameList = array of usernames to validate
async function usernameListValidation(givenUsernameList) {
	// Converts the givenUsernameList to a set to remove any duplicates while ensuring there are no uppercase characters as per database requirements
	const givenUsernameSet = new Set(
		givenUsernameList.map((username) => username.toLowerCase())
	);

	// Converts the givenUsernameSet back into an array for future
	const usernamesToFind = Array.from(givenUsernameSet);
	// Initialises users variable
	let users;

	// Checks if there is at least one user given and sets users variable to an empty array if there is not
	if (givenUsernameSet.size === 0) {
		users = [];
	} else {
		// Fetches an array of User documents, containing their _id and username, using the $in operator to check if the username field in the User document matches any one of the usernames present in the usernamesToFind array
		users = await User.find({
			username: { $in: usernamesToFind },
		}).select("_id username");
	}

	// Checks whether the users array with the usernames that were found in the database is the same length as the initial length to determine if all the usernames were present in the database
	if (users.length !== givenUsernameSet.size) {
		// Creates a set containing the usernames that have been found
		const foundUsernames = new Set(users.map((user) => user.username));
		// Creates an array of the usernames that were not found by removing the found usernames
		const notFoundUsernames = usernamesToFind.filter(
			(username) => !foundUsernames.has(username)
		);

		// Throws an error listing the usernames that were not found
		throw new GraphQLError(
			`The following users could not be found: ${notFoundUsernames.join(
				", "
			)}`,
			{ extensions: { code: "USER_NOT_FOUND" } }
		);
	}

	// Converts the array of user documents containing _id and username to an array containing just the strings of the user ID
	const userIDs = users.map((user) => user._id.toString());

	// Returns: Array of strings of user IDs from the validated list of usernames
	return userIDs;
}

// @function processCreatorInUsernameList
// Gets processed username list that checks for existing usernames, changes all the usernames to IDs and checks that the creator always included and not duplicated
// Parameters:
//    creatorID = ID of user creating the Event
//    creatorUsername = username of user creating the Event
//    attendees = array of usernames to process and validate
// Function Calls: usernameListValidation
async function processCreatorInUsernameList(
	creatorID,
	creatorUsername,
	attendees
) {
	// Initialises the finalAttendees array with it containing the creator's ID
	let finalAttendees = [creatorID.toString()];

	// Checks whether attendees has a value and there's at least one entry in the attendees array
	if (attendees && attendees.length > 0) {
		// Removes the creator's username from the list if present
		const attendeesWithoutCreator = attendees.filter(
			(attendee) => attendee.toLowerCase() !== creatorUsername
		);
		// Checks if there are attendee usernames other than the creator's username
		if (attendeesWithoutCreator.length) {
			// Validates the attendee usernames
			const userList = await usernameListValidation(attendees);

			// Adds the validated array to the current finalAttendees array which contains the creator's ID
			finalAttendees = [...finalAttendees, ...userList];
		}
	}
	return finalAttendees;
}

module.exports = resolvers;
