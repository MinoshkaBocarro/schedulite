import { useQuery } from "@apollo/client/react";
import { useState, useEffect, useContext } from "react";

import AuthContext from "../../../context/authContext";

import Calendar from "./Calendar";
import EventsList from "./EventsAccordion/EventsList";

import { GET_EVENTS_FOR_CALENDAR } from "../../../graphQL/queries/queries";

import MbLoader from "../../common/MbLoader";
import { toast } from "react-toastify";

function CalendarContainer() {
	const { getCurrentUser } = useContext(AuthContext);

	const user = getCurrentUser();

	const [events, setEvents] = useState([]);
	const [selectedEventID, setSelectedEventID] = useState(null);

	const { loading, error, data, refetch } = useQuery(
		GET_EVENTS_FOR_CALENDAR,
		{
			context: {
				headers: {
					authorization: user.token,
				},
			},
		}
	);

	useEffect(() => {
		if (data && data.getUsersEvents) {
			const eventArray = data.getUsersEvents.map((event) => {
				console.log("event");
				console.log(event);
				return {
					id: event.id,
					title: event.title,
					start: event.startTime,
					end: event.endTime,
				};
			});
			setEvents(eventArray);
		}
	}, [data]);

	const handleEventClick = async (info) => {
		const eventID = info.event.id || null;
		setSelectedEventID(eventID);
	};

	// style this properly
	if (loading) return <MbLoader />; //
	if (error) {
		toast.error(error.message);
	}

	return (
		<div className="calendar-container">
			{/* Passing refetch?? */}
			<Calendar events={events} eventClick={handleEventClick} />
			<EventsList
				events={events}
				eventClick={handleEventClick}
				selectedEventID={selectedEventID}
				user={user}
				refetchEvents={refetch}
			/>
		</div>
	);
}

export default CalendarContainer;
