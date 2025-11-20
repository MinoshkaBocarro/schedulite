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

				isAttending(event, context);

				return event;
			} catch (error) {
				throw new GraphQLError(
					`Failed to fetch event: ${error.message}`,
					{ extensions: { code: "FETCH_EVENT_ERROR" } }
				);
			}
		},
	},
};

module.exports = resolvers;
