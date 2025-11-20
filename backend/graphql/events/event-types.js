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

	input CreateEventInput {
		title: String!
		description: String
		location: String
		startTime: DateTime!
		endTime: DateTime
		attendees: [ID]
	}

	input UpdateEventInput {
		title: String
		description: String
		location: String
		startTime: DateTime
		endTime: DateTime
		attendees: [ID]
	}

	type Query {
		getEvent(id: ID!): Event
		getUsersEvents: [Event]
	}

	type Mutation {
		createEvent(input: CreateEventInput): Event
		updateEvent(id: ID!, input: UpdateEventInput!): Event
		deleteEvent(id: ID!): Event
	}
`;

module.exports = eventTypeDefs;
