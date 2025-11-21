// Components
import MbButtonLink from "../components/common/MbButtonLink";
import Title from "../components/common/Title";

function NotFound() {
	return (
		<div className="not-found-page">
			<Title>Sorry!</Title>
			<p>This page doesn't exist...</p>
			<p>Head back for now!</p>
			<MbButtonLink to={"/"}>Home</MbButtonLink>
		</div>
	);
}

export default NotFound;
