import styles from "./MbButton.module.scss";

function MbButton({ children, onClick, type }) {
	return (
		<button
			className={styles.button}
			onClick={onClick}
			type={type ? type : "button"}
		>
			{children}
		</button>
	);
}

export default MbButton;
