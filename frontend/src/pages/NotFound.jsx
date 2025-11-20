// Components
import MbButtonLink from "../components/common/MbButtonLink";
import Title from "../components/common/Title";

function NotFound() {
	return (
		<>
			<Title>Sorry!</Title>
			<p>This page doesn't exist...</p>
			<p>Head back for now!</p>
			<MbButtonLink to={"/"}>Home</MbButtonLink>
		</>
	);
}

export default NotFound;
