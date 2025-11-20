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
};

module.exports = resolvers;
