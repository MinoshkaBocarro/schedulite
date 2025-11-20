function ClosedEventCard({ cardData, onClickOpen }) {
	const { id, title } = cardData;

	return (
		<div
			className="card card-heading closed"
			onClick={() => {
				onClickOpen({ event: { id } });
			}}
		>
			<h3
				onClick={() => {
					onClickOpen({ event: { id } });
				}}
			>
				{title}
			</h3>
		</div>
	);
}

export default ClosedEventCard;
