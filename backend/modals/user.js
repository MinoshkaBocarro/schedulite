const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 50,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 1024,
		},
		firstName: {
			type: String,
			maxlength: 255,
		},
		lastName: {
			type: String,
			maxlength: 255,
		},
		email: {
			type: String,
			minlength: 5,
			maxlength: 255,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports.User = User;
