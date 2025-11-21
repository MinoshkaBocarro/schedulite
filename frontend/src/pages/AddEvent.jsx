// Apollo imports
import { useMutation } from "@apollo/client/react";

// React imports
import { useNavigate } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";

// Form imports
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// GraphQL mutations and queries imports
import { CREATE_EVENT } from "../graphQL/mutations/mutations";

// Component Imports
import MbButton from "../components/common/MbButton";
import MbButtonLink from "../components/common/MbButtonLink";

// Function Imports
import { processAttendeeArray } from "../helpers/attendeeProcessing";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import AuthContext from "../context/authContext";

// Component Imports
// import { MbButtonLink } from "../components/common/MbButtonLink";

function AddEvent() {
	const navigate = useNavigate();
	const { getCurrentUser } = useContext(AuthContext);
	const user = getCurrentUser();

	const [loading, setLoading] = useState(false);

	const [createEvent] = useMutation(CREATE_EVENT, {
		update(cache, { data: { createEvent } }) {
			cache.modify({
				fields: {
					events(existingEvents = []) {
						const newEvent = cache.writeFragment({
							data: createEvent,
							fragment: gql`
								fragment NewEvent on Event {
									title
									description
									location
									startTime
									endTime
									attendees
								}
							`,
						});
						return [...existingEvents, newEvent];
					},
				},
			});
		},
	});

	const addEvent = async (data, token) => {
		const { title, description, location, startTime, endTime, attendees } =
			data;

		try {
			const result = await createEvent({
				variables: {
					input: {
						title,
						description: description || null,
						location: location || null,
						startTime,
						endTime: endTime || null,
						attendees: attendees,
					},
				},
				context: {
					headers: {
						authorization: `${token}`,
					},
				},
			});
			return result;
		} catch (error) {
			throw Error(error.message);
		}
	};

	const schema = Joi.object({
		title: Joi.string().min(3).max(50).required(),
		description: Joi.string().optional().max(5000).allow("", null),
		location: Joi.string().max(5000).optional().allow("", null),
		startTime: Joi.date().iso().required().messages({
			"date.base": "You must provide a start time for the event",
		}),
		endTime: Joi.date()
			.iso()
			.min(Joi.ref("startTime"))
			.optional()
			.allow("", null),
		attendeeInputString: Joi.string().allow("", null),
		attendees: Joi.array()
			.items(
				Joi.string().min(3).max(50).lowercase().messages({
					"string.min":
						"Each username must be at least 3 characters.",
					"string.max": "Each username cannot exceed 50 characters.",
				})
			)
			.optional(),
		createdBy: Joi.forbidden(),
	});

	const onSubmit = async (formData) => {
		setLoading(loading);
		try {
			const validationResult = processAttendeeArray(
				formData.attendeeInputString
			);

			if (!validationResult) {
				throw new Error("Attendee list is invalid");
			}

			const { title, description, location, startTime, endTime } =
				formData;

			await addEvent(
				{
					title,
					description: description || null,
					location: location || null,
					startTime,
					endTime: endTime || null,
					attendees: validationResult,
				},
				user.token
			);

			navigate("/");
		} catch (error) {
			toast.error(`Failed to add event: ${error.message}`);
			setTimeout(() => {
				setLoading(false), 1000;
			});
		}
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			location: "",
			startTime: "",
			endTime: "",
			attendeeInputString: "",
		},
		resolver: joiResolver(schema),
	});

	return (
		<>
			<Form
				onSubmit={handleSubmit(onSubmit)}
				className="p-4 border rounded shadow-sm"
				data-bs-theme="dark"
			>
				<h2 className="mb-4">Add Event</h2>

				{/* Title */}
				<Form.Group className="mb-3">
					<Form.Label>Title *</Form.Label>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								placeholder="Event Title"
								isInvalid={errors.title}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.title?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* Description */}
				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								as="textarea"
								rows={3}
								isInvalid={errors.description}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.description?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* Location */}
				<Form.Group className="mb-3">
					<Form.Label>Location</Form.Label>
					<Controller
						name="location"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								placeholder="Event Location"
								isInvalid={errors.location}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.location?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* Start Time */}
				<Form.Group className="mb-3">
					<Form.Label>Start Time *</Form.Label>
					<Controller
						name="startTime"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="datetime-local"
								isInvalid={errors.startTime}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{console.log(errors.startTime)}
						{errors.startTime?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* End Time */}
				<Form.Group className="mb-3">
					<Form.Label>End Time</Form.Label>
					<Controller
						name="endTime"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="datetime-local"
								isInvalid={errors.endTime}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.endTime?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* Attendees Input (Comma-Separated String) */}
				<Form.Group className="mb-3">
					<Form.Label>
						Attendees (Comma-separated usernames)
					</Form.Label>
					<Controller
						name="attendeeInputString"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								placeholder="username1, username2, username3"
								isInvalid={errors.attendeeInputString}
							/>
						)}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.attendeeInputString?.message}
					</Form.Control.Feedback>
				</Form.Group>
				<div className="button-container">
					<MbButtonLink to="/">Back</MbButtonLink>
					<MbButton loadingState={loading} type="submit">
						{loading ? (
							<Spinner animation="border" variant="light" />
						) : (
							"Add Event"
						)}
					</MbButton>
				</div>
			</Form>
		</>
	);
}

export default AddEvent;
