const gql = require("graphql-tag");

const userTypeDefs = gql`
	type User {
		id: ID!
		username: String!
		email: String
		firstName: String
		lastName: String
		events: [Event]
		token: String
	}

	input CreateUserInput {
		username: String!
		password: String!
		email: String
		firstName: String
		lastName: String
	}

	input UpdateUserInput {
		username: String
		password: String
		email: String
		firstName: String
		lastName: String
	}

	type Query {
		getUser(id: ID!): User
		getUsers: [User]
	}

	type Mutation {
		createUser(input: CreateUserInput): User
		updateUser(id: ID!, input: UpdateUserInput!): User
		deleteUser(id: ID!): User
	}
`;

module.exports = userTypeDefs;
