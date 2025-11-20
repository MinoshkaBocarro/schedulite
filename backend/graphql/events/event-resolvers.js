// GraphQL Resolvers for Event Type
// It handles field resolvers and CRUD operations for Events

// Requirements
// Mongoose Models: User and Event

// Resolver List
// Type Event: createdBy, attendees
// Type Query: getEvent, getUsersEvent
// Type Mutation: createEvent, updateEvent, deleteEvent

// Helper Function List
// isAuthenticated
// isAuthorised
// usernameListValidation

// Package Imports
const _ = require("lodash");

// Error Handler Imports
const ErrorHandler = require("../../utilities/errorHandler");

// Auth Imports
const {
	isAuthenticated,
	isAttending,
	isEventCreator,
} = require("../../helpers/auth");

// Mongoose Model Imports
const {
	Event,
	validateEvent,
	validateEventUpdate,
} = require("../../models/event");
const { User } = require("../../models/user");

const resolvers = {
	// Field resolvers for Event Type
	Event: {
		// Resolves createdBy field
		// Parameter: parent = the current Event document being resolved
		createdBy: async (parent) => {
			// Fetches the full User document based on the ID of User stored in the current Event document
			const creator = await User.findById(parent.createdBy);
			// Returns: Full User document

			return creator;
		},

		// Resolves attendees field
		// Parameter: parent = the current Event document being resolved
		attendees: async (parent) => {
			// Fetches an array of full User documents using the $in operator to check if the _id field in the User document matches any one of the IDs present in the parent.attendees array
			// parent.attendees = array of User IDs stored in the current Event document

			const attendees = await User.find({
				_id: { $in: parent.attendees },
			});
			// Returns: Array of full User documents
			return attendees;
		},
	},

	// Query resolvers for Event Type
	Query: {
		// Resolves getEvent query
		// Parameters:
		//    args = requires id
		//    context = checks for user
		getEvent: async (parent, args, context) => {
			try {
				// Checks if the user has been authenticated
				isAuthenticated(context);

				// Fetches the full event document from the ID that has been provided in the args
				const event = await Event.findById(args.id);

				// Checks if the event exists and throws and error if it does not
				if (!event) {
					ErrorHandler.throwError(
						// Error details
						"Event does not exist",
						"GET_EVENT_ERROR"
					);
				}

				// Checks if the user has been authorised to access the event by checking if they're on the attendee list
				isAttending(event, context);

				// Returns: Full Event document
				return event;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch event: ${error.message}`,
					"FETCH_EVENT_ERROR"
				);
			}
		},

		// Resolves getUsersEvents query
		// Parameters:
		//    context = checks for user, uses user._id
		getUsersEvents: async (parent, args, context) => {
			try {
				// Checks if the user has been authenticated
				isAuthenticated(context);

				// Gets the user's ID from the context
				const userID = context.user._id;

				// Fetches all the events where the user is has been listed as an attendee
				const events = await Event.find({ attendees: userID });

				// Checks if there are no events
				if (!events.length) {
					// Returns: Empty array
					return [];
				}

				// Returns: Array of full Event documents
				return events;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					// Error details
					`Failed to fetch events ${error.message}`,
					"FETCH_EVENTS_ERROR"
				);
			}
		},
	},

	// Mutation resolvers for Event Type
	Mutation: {
		// Resolves createEvent mutation
		// Parameters
		//    args = uses input
		//    context = checks for user, uses user._id and user.username
		createEvent: async (parent, args, context) => {
			try {
				// Checks if the user has been authenticated
				isAuthenticated(context);

				// Gets the user id and username from context to denote as the Event's creator
				const creatorID = context.user._id;
				const creatorUsername = context.user.username;

				// Destructures attendees Array and the rest of the input data
				const { attendees, ...inputData } = args.input;

				// Gets processed username list that checks for existing usernames, changes all the usernames to IDs and checks that the creator always included and not duplicated
				const finalAttendees = await processCreatorInUsernameList(
					creatorID,
					creatorUsername,
					attendees
				);

				// Reconstructs the event data with the validated and processed data
				const eventData = {
					...inputData,
					createdBy: creatorID,
					attendees: finalAttendees,
				};

				// Validates the event
				const { error, value } = validateEvent(eventData);

				if (error) {
					ErrorHandler.throwError(
						// Error Details
						`Invalid input data: ${error.details[0].message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				// Creates a new event document from the Event model
				const event = new Event(value);
				// Saves the new event document to the database
				await event.save();

				// Returns: Full Event document
				return event;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to create event ${error.message}`,
					"CREATE_EVENT_ERROR"
				);
			}
		},

		// Resolves update mutation
		// Parameters
		//    args = uses input and id
		//    context = checks for user, uses user._id and user.username
		updateEvent: async (parent, args, context) => {
			try {
				// Checks if the user has been authenticated
				isAuthenticated(context);

				// Gets the user id and username from context to denote as the Event's creator
				const creatorID = context.user._id;
				const creatorUsername = context.user.username;

				// Destructures attendees Array and the rest of the input data
				const { attendees, ...inputData } = args.input;

				// Fetches the full event document from the ID that has been provided in the args
				const event = await Event.findById(args.id);

				// Checks if the event exists and throws and error if it does not
				if (!event) {
					ErrorHandler.throwError(
						// Error details
						`Event not found: ${error.message}`,
						"EVENT_NOT_FOUND",
						{ http: { status: 404 } }
					);
				}

				// Checks if the user is the creator before proceeding
				isEventCreator(event, context);

				// Gets processed username list that checks for existing usernames, changes all the usernames to IDs and checks that the creator always included and not duplicated
				const finalAttendees = await processCreatorInUsernameList(
					creatorID,
					creatorUsername,
					attendees
				);

				// Reconstructs the event data with the validated and processed data
				const eventData = {
					...inputData,
					attendees: finalAttendees,
				};

				// Validates the event
				const { error, value } = validateEventUpdate(eventData);

				// Checks if the event validation has thrown an Error
				if (error) {
					ErrorHandler.throwError(
						`Invalid input data: ${error.details[0].message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				// Updates the event document in the database by finding its ID
				const updatedEvent = await Event.findByIdAndUpdate(
					args.id,
					{ $set: value },
					{ new: true }
				);

				// Returns: Full Event document
				return updatedEvent;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to update event: ${error.message}`,
					"UPDATE_EVENT_ERROR"
				);
			}
		},

		// Resolves deleteEvent mutation
		// Parameters
		//    args = uses id
		//    context = checks for user, uses user._id
		deleteEvent: async (parent, args, context) => {
			try {
				// Checks if the user has been authenticated
				isAuthenticated(context);

				// Fetches the full event document from the ID that has been provided in the args
				const event = await Event.findById(args.id);

				// Checks if the event exists and throws and error if it does not
				if (!event) {
					ErrorHandler.throwError(
						`Event does not exist`,
						"DELETE_EVENT_ERROR"
					);
				}

				// Checks if the user is the creator before proceeding
				isEventCreator(event, context);

				// Deletes the event document in the database by finding its ID
				const deletedEvent = await Event.findByIdAndDelete(args.id);

				// Returns: Full Event document
				return deletedEvent;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to delete event:: ${error.message}`,
					"DELETE_EVENT_ERROR"
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
		ErrorHandler.throwError(
			`The following users could not be found: ${notFoundUsernames.join(
				", "
			)}`,
			"USER_NOT_FOUND"
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
