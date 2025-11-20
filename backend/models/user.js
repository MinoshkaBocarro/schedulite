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

function validateUser(user) {
	const schema = Joi.object({
		username: Joi.string().min(3).max(50).required().lowercase(),
		password: Joi.string().min(8).max(1024).required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.min(5)
			.max(255)
			.optional()
			.allow(null),
		firstName: Joi.string().max(255).optional().allow(null),
		lastName: Joi.string().max(255).optional().allow(null),
	});

	return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
