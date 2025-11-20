// Import packages
const _ = require("lodash");

// Import error handler
const ErrorHandler = require("../../../utilities/errorHandler");

// Import model
const {
	User,
	validateUser,
	validateLogin,
	validateUserUpdate,
} = require("../../models/user");

// Import auth
const { isAuthenticated, isTheSameUser } = require("../../helpers/auth");

const resolvers = {
	User: {
		events: async (parent) => {
			const events = await Event.find({ attendees: parent._id });
			return events;
		},
	},
	Query: {
		getUser: async (parent, args, context) => {
			try {
				isAuthenticated(context);

				// Get the user by id
				const user = await User.findById(args.id);

				// If the user does not exist, throw an error
				if (!user) {
					ErrorHandler.throwError(
						"User does not exist",
						"GET_USER_ERROR"
					);
				}

				isTheSameUser(user, context);

				return user;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch user: ${error.message}`,
					"FETCH_USER_ERROR"
				);
			}
		},

		getUsers: async (parent, args) => {
			try {
				const users = await User.find();

				// If there are no users
				if (!users.length) {
					ErrorHandler.throwError(
						"No users found",
						"GET_USERS_ERROR"
					);
				}

				return users;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to fetch users ${error.message}`,
					"FETCH_USERS_ERROR"
				);
			}
		},
	},

	Mutation: {
		createUser: async (parent, args) => {
			try {
				const { error, value } = validateUser(args.input);

				// Check if filled in user data is correct
				if (error) {
					ErrorHandler.throwError(
						`Invalid input data: ${error.details[0].message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				// Check for existing user
				const givenUsername = user.username;
				const existingUser = await User.findOne({
					username: givenUsername,
				});

				if (existingUser) {
					ErrorHandler.throwError(
						"The username already exists",
						"BAD_USER_INPUT",
						{ invalidArgs: user.username }
					);
				}

				const user = new User(value);
				await user.save();

				// Generate auth token for the new user
				const token = user.generateAuthToken();

				// Construct user data
				let userData = _.pick(user, [
					"id",
					"username",
					"email",
					"firstName",
					"lastName",
					"createdAt",
				]);
				userData.token = token;

				return userData;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to create user ${error.message}`,
					"CREATE_USER_ERROR"
				);
			}
		},

		loginUser: async (parent, args) => {
			try {
				const { error, value } = validateLogin(args.input);

				// Check if filled in user data is correct
				if (error) {
					ErrorHandler.throwError(
						`Invalid input data: ${error.details[0].message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				// Check if user is in the database
				const user = await User.findOne({ username: value.username });

				if (!user) {
					ErrorHandler.throwError(
						`Invalid username or password`,
						"UNAUTHORISED",
						{
							http: { status: 401 },
						}
					);
				}
				// Check if userPassword is correct
				const validPassword = await user.comparePassword(
					value.password,
					user.password
				);

				if (!user) {
					ErrorHandler.throwError(
						`Invalid username or password`,
						"UNAUTHORISED",
						{
							http: { status: 401 },
						}
					);
				}

				const token = user.generateAuthToken();

				let userData = _.pick(user, [
					"id",
					"username",
					"email",
					"firstName",
					"lastName",
					"createdAt",
				]);
				userData.token = token;

				return userData;
			} catch (error) {
				ErrorHandler.catchError(
					error,
					`Failed to login ${error.message}`,
					"LOGIN_USER_ERROR"
				);
			}
		},

		updateUser: async (parent, args, context) => {
			try {
				isAuthenticated(context);

				// Check for user
				const user = await User.findById(args.id);

				if (!user) {
					ErrorHandler.throwError(
						`User not found: ${error.message}`,
						"USER_NOT_FOUND",
						{
							http: { status: 404 },
						}
					);
				}

				isTheSameUser(user, context);

				const { error, value } = validateUserUpdate(args.input);

				if (error) {
					ErrorHandler.throwError(
						`Invalid input data: ${error.details[0].message}`,
						"BAD_USER_INPUT",
						{ invalidArgs: args.input }
					);
				}

				const updatedUser = await User.findByIdAndUpdate(
					args.id,
					value,
					{
						new: true,
					}
				);

				return updatedUser;
			} catch (error) {
				ErrorHandler.catchError(
					`Failed to update user:${error.message}`,
					"UPDATE_USER_ERROR"
				);
			}
		},
	},
};

module.exports = resolvers;
