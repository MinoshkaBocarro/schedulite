import { useEffect } from "react";
import MbButtonLink from "../../../common/MbButtonLink";
import EventsItem from "./EventsItem";

function EventsList({
	events,
	eventClick,
	selectedEventID,
	user,
	refetchEvents,
}) {
	useEffect(() => {
		refetchEvents();
	}, []);

	return (
		<div className="events-container">
			<div className="add-event">
				<MbButtonLink to="/event/add">+</MbButtonLink>
			</div>
			<div className="events-list">
				{events.map((event) => {
					const id = event.id;
					return (
						<EventsItem
							key={id}
							cardData={event}
							isActive={id === selectedEventID ? true : false}
							onClickOpen={(info) => eventClick(info)}
							onClickClose={() =>
								eventClick({ event: { id: null } })
							}
							user={user}
							refetchEvents={refetchEvents}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default EventsList;
