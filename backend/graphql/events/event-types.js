const gql = require("graphql-tag");

const eventTypeDefs = gql`
	scalar DateTime

	type Event {
		id: ID!
		title: String!
		description: String
		location: String
		startTime: DateTime!
		endTime: DateTime
		createdBy: User!
		attendees: [User]
	}
`;

module.exports = eventTypeDefs;
