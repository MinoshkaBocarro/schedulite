const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// double check these defaults
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

module.exports.Event = Event;
