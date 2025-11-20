import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { format } from "date-fns";

import { GET_EVENT } from "../../../../graphQL/queries/queries";
import MbButtonLink from "../../../../../../done/common/MbButtonLink";
import MbButton from "../../../../../../done/common/MbButton";
import { DELETE_EVENT } from "../../../../graphQL/mutations/mutations";
import MbLoader from "../../../../../../done/common/MbLoader";
import { toast } from "react-toastify";

function OpenEventCard({ cardData, onClickClose, user, refetchEvents }) {
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

			// If event exists, than update it with the updated event details
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

	// style this properly
	if (loading) return <MbLoader />; //
	// if (true) return <MbLoader />; //
	if (error) {
		toast.error(error.message);
	}

	return (
		<div className="card open" onClick={onClickClose}>
			{eventData ? (
				<>
					{eventData.title && (
						<h3 className="event-title card-heading">
							{eventData.title}
						</h3>
					)}
					{eventData.description && (
						<p className="event-description">
							{eventData.description}
						</p>
					)}
					{eventData.location && (
						<p className="event-location">{eventData.location}</p>
					)}
					{eventData.startTime && (
						<p className="event-start">
							Start:{" "}
							{format(
								new Date(eventData.startTime),
								"MMM d, yyyy, h:mma"
							)}
						</p>
					)}
					{eventData.endTime && (
						<p className="event-end">
							End:{" "}
							{format(
								new Date(eventData.endTime),
								"MMM d, yyyy, h:mma"
							)}
						</p>
					)}
					{eventData.attendees?.length > 0 && (
						<p className="event-attendees">
							<p>Attendees:</p>
							<ul>
								{eventData.attendees.map((attendee) => (
									<li key={attendee.username}>
										{attendee.username}
									</li>
								))}
							</ul>
						</p>
					)}
					{/* SAVE BEFORE TRYING CREATEDBY */}
					{eventData.createdBy && (
						<p className="event-createdBy">
							Created by: {eventData.createdBy.username}
						</p>
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
			) : (
				// style this properly
				<p>Loading</p>
			)}
		</div>
	);
}

export default OpenEventCard;
