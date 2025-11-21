import styles from "./MbButton.module.scss";

function MbButton({ children, onClick, type, loadingState }) {
	return (
		<button
			className={styles.button}
			onClick={onClick}
			type={type ? type : "button"}
			disabled={loadingState ? true : false}
		>
			{children}
		</button>
	);
}

export default MbButton;
