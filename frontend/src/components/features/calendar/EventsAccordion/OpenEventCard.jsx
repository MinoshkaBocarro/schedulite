import { useMutation, useQuery } from "@apollo/client/react";
import { useContext, useEffect, useState } from "react";
import { IoMdCheckboxOutline } from "react-icons/io";
import { toast } from "react-toastify";

import { format } from "date-fns";

// GraphQL imports
import { GET_EVENT } from "../../../../graphQL/queries/queries";
import { DELETE_EVENT } from "../../../../graphQL/mutations/mutations";

// Component imports
import MbButtonLink from "../../../common/MbButtonLink";
import MbButton from "../../../common/MbButton";
import MbLoader from "../../../common/MbLoader";

// Context import
import AuthContext from "../../../../context/authContext";

function OpenEventCard({ cardData, onClickClose, refetchEvents }) {
	const { getCurrentUser } = useContext(AuthContext);
	const user = getCurrentUser();
	const { id } = cardData;
	const [eventData, setEventData] = useState();

	const { loading, error, data } = useQuery(GET_EVENT, {
		variables: { eventID: id },
		context: {
			headers: {
				authorization: user.token,
			},
		},
	});

	const [deleteEvent] = useMutation(DELETE_EVENT, {
		update(cache, { data: { deleteEvent } }) {
			// can only delete an event if user is a creator

			// Getting the event variables
			const { getEvent } = cache.readQuery({
				query: GET_EVENT,
				// not sure if I use eventID or ID here??
				variables: { eventID: id },
			}) || { getEvent: null };

			// TODO If event exists, than update it with the updated event details
			if (getEvent) {
				cache.writeQuery({
					query: DELETE_EVENT,
					variables: { eventID: id },
				});
			}
		},
	});

	const handleDelete = async () => {
		await deleteEvent({
			variables: {
				eventID: id,
				user: user.id,
			},
			context: { headers: { authorization: `${user.token}` } },
		});
		refetchEvents();
	};

	useEffect(() => {
		console.log(data);
		if (data && data.getEvent) {
			setEventData(data.getEvent);
		}
	}, [data]);

	// TODO delete
	console.log(loading);
	if (loading) return <MbLoader />; //
	if (error) {
		toast.error(error.message);
	}

	return (
		<div className="card open" onClick={onClickClose}>
			{eventData && (
				<>
					{eventData.title && (
						<h3 className="event-title card-heading">
							{eventData.title}
						</h3>
					)}
					{eventData.description && (
						<div className="event-description">
							{eventData.description}
						</div>
					)}
					{eventData.location && (
						<div className="event-location">
							{eventData.location}
						</div>
					)}
					{eventData.startTime && (
						<div className="event-start">
							Start:{" "}
							{format(
								new Date(eventData.startTime),
								"MMM d, yyyy, h:mma"
							)}
						</div>
					)}
					{eventData.endTime && (
						<div className="event-end">
							End:{" "}
							{format(
								new Date(eventData.endTime),
								"MMM d, yyyy, h:mma"
							)}
						</div>
					)}
					{eventData.attendees?.length > 0 && (
						<div className="event-attendees">
							<div>Attendees:</div>
							<div className="attendee-list">
								{eventData.attendees.map((attendee) => (
									<div key={attendee.username}>
										<IoMdCheckboxOutline />
										{attendee.username}
									</div>
								))}
							</div>
						</div>
					)}
					{/* SAVE BEFORE TRYING CREATEDBY */}
					{eventData.createdBy && (
						<div className="event-createdBy">
							Created by: {eventData.createdBy.username}
						</div>
					)}
					{user.id === eventData.createdBy.id && (
						<div className="button-container">
							<MbButtonLink to={`event/edit/${id}`}>
								Edit
							</MbButtonLink>
							<MbButton onClick={handleDelete}>Delete</MbButton>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default OpenEventCard;
