import ClosedEvent from "./ClosedEventCard";
import OpenEvent from "./OpenEventCard";

function EventsItem({
	cardData,
	isActive,
	onClickOpen,
	onClickClose,
	user,
	refetchEvents,
}) {
	return (
		<>
			{isActive ? (
				<OpenEvent
					cardData={cardData}
					onClickClose={onClickClose}
					user={user}
					refetchEvents={refetchEvents}
				/>
			) : (
				<ClosedEvent cardData={cardData} onClickOpen={onClickOpen} />
			)}
		</>
	);
}

export default EventsItem;
