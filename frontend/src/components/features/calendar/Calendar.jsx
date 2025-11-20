import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar({ events, eventClick }) {
	return (
		<div className="full-calendar-container">
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				eventClick={eventClick}
				height="100%"
				expandRows={true}
				dayMaxEvents={true}
			></FullCalendar>
		</div>
	);
}

export default Calendar;
