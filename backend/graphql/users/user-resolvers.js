const ErrorHandler = require("../../../utilities/errorHandler");
const { User } = require("../../models/user");

const resolvers = {
	User: {
		events: async (parent) => {
			const events = await Event.find({ attendees: parent._id });
			return events;
		},
	},
	Query: {
		getUser: async (parent, args) => {
			try {
				// Get the user by id
				const user = await User.findById(args.id);

				// If the user does not exist, throw an error
				if (!user) {
					ErrorHandler.throwError(
						"User does not exist",
						"GET_USER_ERROR"
					);
				}

				return user;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch user: ${error.message}`,
					"FETCH_USER_ERROR"
				);
			}
		},
	},
};

module.exports = resolvers;
