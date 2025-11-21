// Apollo imports
import { useMutation, useQuery } from "@apollo/client/react";

// React imports
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/authContext";

// Form imports
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { format, parseISO, isValid } from "date-fns";

// GraphQL mutations and queries imports
import { UPDATE_EVENT } from "../graphQL/mutations/mutations";
import { GET_EVENT } from "../graphQL/queries/queries";

// Function Imports
import { processAttendeeArray } from "../helpers/attendeeProcessing";

// Component Imports
import MbButtonLink from "../components/common/MbButtonLink";
import MbButton from "../components/common/MbButton";
import { toast } from "react-toastify";

function EditEvent() {
	const { getCurrentUser } = useContext(AuthContext);
	const user = getCurrentUser();
	const { eventID } = useParams();
	const navigate = useNavigate();

	const [submissionLoading, setSubmissionLoading] = useState(false);

	const { loading, error, data } = useQuery(GET_EVENT, {
		variables: { eventID: eventID },
		context: {
			headers: {
				authorization: user.token,
			},
		},
	});

	const [updateEvent] = useMutation(UPDATE_EVENT, {
		update(cache, { data: { updateEvent } }) {
			// Getting the event variables
			const { getEvent } = cache.readQuery({
				query: GET_EVENT,
				// not sure if I use eventID or ID here??
				variables: { eventID: eventID },
			}) || { getEvent: null };

			// If event exists, than update it with the updated event details
			if (getEvent) {
				cache.writeQuery({
					query: GET_EVENT,
					variables: { id: eventID },
					// Ensure event details that are not updated/rendered in the form are preserved
					data: { getEvent: { ...getEvent, ...updateEvent } },
				});

				console.log("readQuerycheck");
				// it seems to work for both eventID and ID???
				console.log(
					cache.readQuery({
						query: GET_EVENT,
						variables: { id: eventID },
					}) || { getEvent: null }
				);
			}
		},
	});

	const schema = Joi.object({
		title: Joi.string().min(3).max(50),
		description: Joi.string().optional().max(5000).allow("", null),
		location: Joi.string().max(5000).optional().allow("", null),
		startTime: Joi.date().iso().required(),
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
		setSubmissionLoading(true);
		try {
			const validationResult = processAttendeeArray(
				formData.attendeeInputString
			);

			// this should not happen but just for handling
			if (!validationResult) {
				throw new Error("Attendee list is invalid");
			}

			const { title, description, location, startTime, endTime } =
				formData;

			await updateEvent({
				variables: {
					updateEventID: eventID,
					input: {
						title,
						description: description || null,
						location: location || null,
						startTime,
						endTime: endTime || null,
						attendees: validationResult,
					},
					user: user.id,
				},
				context: { headers: { authorization: `${user.token}` } },
			});
			navigate("/");
		} catch (error) {
			toast.error(`Failed to update event: ${error.message}`);
			setTimeout(() => {
				setSubmissionLoading(false), 1000;
			});
		}
	};

	// check those that I'm not using
	const {
		control,
		watch,
		handleSubmit,
		setValue,
		reset,
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

	useEffect(() => {
		if (data && data.getEvent) {
			const event = data.getEvent;
			const attendeeInputString = (event.attendees || [])
				.map((attendee) => attendee.username)
				.join(", ");

			const formatDateTime = (isoString) => {
				if (!isoString) {
					return "";
				}

				const date = parseISO(isoString);

				if (!isValid(date)) {
					return "";
				}
				return format(date, "yyyy-MM-dd'T'HH:mm");
			};

			reset({
				title: event.title || "",
				description: event.description || "",
				location: event.location || "",
				startTime: formatDateTime(event.startTime),
				endTime: formatDateTime(event.endTime),
				attendeeInputString: attendeeInputString,
			});
		}
	}, [data, reset]);

	if (loading) {
		return <div className="p-5 text-center">Loading event details...</div>;
	}

	if (error) {
		toast.error(`Event fetch error: ${error.message}`);
	}

	if (data && !data.getEvent) {
		return (
			<div className="p-5 text-center text-warning">Event not found.</div>
		);
	}

	return (
		<>
			<Form
				data-bs-theme="dark"
				// is this right? shouldn't this be an arrow function?? its the handle submit from useForm
				onSubmit={handleSubmit(onSubmit)}
				className="p-4 border rounded shadow-sm"
			>
				<h2 className="mb-4">Edit Event</h2>

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
					<Form.Label>Description (Optional)</Form.Label>
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
					<Form.Label>Location (Optional)</Form.Label>
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
						{errors.startTime?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{/* End Time */}
				<Form.Group className="mb-3">
					<Form.Label>End Time (Optional)</Form.Label>
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
						Attendees (Comma-separated usernames, e.g., 'john, jane,
						mike')
					</Form.Label>
					<Controller
						name="attendeeInputString"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								placeholder="user1, user2, user3"
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
					<MbButton loadingState={submissionLoading} type="submit">
						{submissionLoading ? (
							<Spinner animation="border" variant="light" />
						) : (
							"Edit Event"
						)}
					</MbButton>
				</div>
			</Form>
		</>
	);
}

export default EditEvent;
