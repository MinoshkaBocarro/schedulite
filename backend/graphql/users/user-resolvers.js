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
					throw new GraphQLError(`User does not exist`, {
						extensions: {
							code: "GET_USER_ERROR",
						},
					});
				}

				return user;
			} catch (error) {
				// Check if error is a GraphQLError
				if (error instanceof GraphQLError) {
					throw error;
				}

				// Otherwise, it's an unexpected internal error
				throw new GraphQLError(
					`Failed to fetch user: ${error.message}`,
					{ extensions: { code: "FETCH_USER_ERROR" } }
				);
			}
		},
	},
};

module.exports = resolvers;
