const ErrorHandler = require("../../../utilities/errorHandler");
const { isAuthenticated, isAttending } = require("../../helpers/auth");

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
					`Failed to fetch events ${error.message}`,
					"FETCH_EVENTS_ERROR"
				);
			}
		},
	},
};

module.exports = resolvers;
