// Import Joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Import mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		description: {
			type: String,
			maxlength: 5000,
		},
		location: {
			type: String,
			maxlength: 255,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
		},
		attendees: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

function validateEvent(event) {
	const schema = Joi.object({
		title: Joi.string().min(3).max(50).required(),
		description: Joi.string().max(5000).optional().allow(null),
		location: Joi.string().max(5000).optional().allow(null),
		startTime: Joi.date().required(),
		endTime: Joi.date().min(Joi.ref("startTime")).optional().allow(null),
		attendees: Joi.array().items(Joi.objectId()).optional(),
		createdBy: Joi.objectId().required(),
	});

	return schema.validate(event);
}

module.exports.Event = Event;
module.exports.validateEvent = validateEvent;
