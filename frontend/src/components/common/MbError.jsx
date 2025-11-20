import MbButtonLink from "./MbButtonLink";
import Title from "./Title";

function MbError() {
	return (
		<>
			<Title>Sorry!</Title>
			<p>Something went wrong...</p>
			<p>Head back to the login for now!</p>
			<MbButtonLink to={"/login"}>Home</MbButtonLink>
		</>
	);
}

export default MbError;
