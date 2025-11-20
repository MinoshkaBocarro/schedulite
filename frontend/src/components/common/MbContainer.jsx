import styles from "./MbContainer.module.scss";

function MbContainer({ children }) {
	return <div className={styles.container}>{children}</div>;
}

export default MbContainer;
