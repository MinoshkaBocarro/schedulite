import { IoIosArrowDown } from "react-icons/io";

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
			<IoIosArrowDown className="down-arrow" />
		</div>
	);
}

export default ClosedEventCard;
