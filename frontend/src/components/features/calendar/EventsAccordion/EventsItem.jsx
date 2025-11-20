import ClosedEvent from "./ClosedEventCard";
import OpenEvent from "./OpenEventCard";

function EventsItem({
	cardData,
	isActive,
	onClickOpen,
	onClickClose,
	refetchEvents,
}) {
	return (
		<>
			{isActive ? (
				<OpenEvent
					cardData={cardData}
					onClickClose={onClickClose}
					refetchEvents={refetchEvents}
				/>
			) : (
				<ClosedEvent cardData={cardData} onClickOpen={onClickOpen} />
			)}
		</>
	);
}

export default EventsItem;
