import Joi from "joi";
import { toast } from "react-toastify";

const attendeeArraySchema = Joi.array().items(
	Joi.string().min(3).max(50).lowercase().messages({
		"string.min": "Each username must be at least 3 characters.",
		"string.max": "Each username cannot exceed 50 characters.",
	})
);

function processAttendeeArray(inputString) {
	if (!inputString || inputString.trim() === "") {
		return [];
	}
	// when we're using promises and looking for errors
	// when errors occur what do we do
	try {
		const attendees = inputString
			.split(",")
			.map((username) => username.trim().toLowerCase());

		//
		const { error } = attendeeArraySchema.validate(attendees);

		if (error) {
			// for the user - check your attendee's input
			throw new Error(`Error validating attendees: ${error.message}`);
		}

		const uniqueAttendees = new Set(attendees);
		if (uniqueAttendees.size !== attendees.length) {
			throw new Error("Attendee list contains duplicate usernames.");
		}

		return attendees;
	} catch (error) {
		toast.error(error.message);
	}
}

export { processAttendeeArray };
