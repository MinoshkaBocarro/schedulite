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
`;

module.exports = userTypeDefs;
