import { Dots } from "@holmesdev/ponder-spinners";

// Import styles
import styles from "./MbLoader.module.scss";

function MbLoader() {
	return (
		<div className={styles.loadingContainer}>
			<Dots
				className={styles.loadingSpinner}
				color1="#4db6ac"
				color2="#84ceeb"
				color3="#c68dae"
			/>
		</div>
	);
}

export default MbLoader;
