import { useRef } from "react";

function ClosedEventCard({ cardData, onClickOpen }) {
	const { id, title } = cardData;

	const ref = useRef();

	return (
		<div
			className="card card-heading closed"
			// check this
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
