import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../graphQL/queries/queries";
import { Card, Col, Row } from "react-bootstrap";
import { useContext } from "react";
import MbContainer from "../components/common/MbContainer";
import MbButton from "../components/common/MbButton";
import { toast } from "react-toastify";
import MbButtonLink from "../components/common/MbButtonLink";
import { useNavigate } from "react-router-dom";

function Profile() {
	const navigate = useNavigate();

	const { getCurrentUser } = useContext(AuthContext);
	const user = getCurrentUser();
	const userID = user.id;

	const { loading, error, data } = useQuery(GET_USER, {
		variables: { userID: userID },
		context: {
			headers: {
				authorization: user.token,
			},
		},
	});

	if (loading) {
		return <div className="p-5 text-center">Loading user details...</div>;
	}

	if (error) {
		toast.error(`Error loading user: ${error.message}`);
	}

	if (data && !data.getUser) {
		return (
			<div className="p-5 text-center text-warning">User not found.</div>
		);
	}

	return (
		<div className="login-signup">
			<MbContainer>
				<Card
					className="p-4 shadow-sm"
					style={{ maxWidth: "600px", margin: "2rem auto" }}
				>
					<Card.Title className="profile-title d-flex justify-content-between align-items-center mb-4">
						<h2>
							{data.getUser
								? data.getUser.username
								: user.username}
							's Profile 👤
						</h2>
						<MbButton onClick={handleToggleEdit}>Edit</MbButton>
					</Card.Title>

					<div className="profile-details signup-login">
						<Row className="mb-3">
							<Col sm="4">Username:</Col>
							<Col sm="8">
								<strong>
									{data.getUser
										? data.getUser.username
										: user.username}
								</strong>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col sm="4">Email:</Col>
							<Col sm="8">
								{data.getUser ? data.getUser.email : user.email}
							</Col>
						</Row>

						<Row className="mb-3">
							<Col sm="4">First Name:</Col>
							<Col sm="8">
								{data.getUser
									? data.getUser.firstName
									: user.firstName}
							</Col>
						</Row>

						<Row className="mb-3">
							<Col sm="4">Last Name:</Col>
							<Col sm="8">
								{data.getUser
									? data.getUser.lastName
									: user.lastName}
							</Col>
						</Row>
					</div>
					<MbButtonLink to="/">Back</MbButtonLink>
				</Card>
			</MbContainer>
		</div>
	);
}

export default Profile;
