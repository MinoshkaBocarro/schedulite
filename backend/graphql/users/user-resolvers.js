const resolvers = {
	User: {
		events: async (parent) => {
			const events = await Event.find({ attendees: parent._id });
			return events;
		},
	},
};

module.exports = resolvers;
