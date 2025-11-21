// Apollo and GraphQL Imports
import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../graphQL/queries/queries";

// React imports
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Component imports
import { toast } from "react-toastify";

import MbContainer from "../components/common/MbContainer";
import MbButtonLink from "../components/common/MbButtonLink";

// Context imports
import AuthContext from "../context/authContext";
import MbLoader from "../components/common/MbLoader";

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
		return <MbLoader />;
	}

	if (error) {
		toast.error(`Error loading user: ${error.message}`);
	}

	return (
		<div className="login-signup">
			<MbContainer>
				<div className="profile-container">
					<div className="profile-title">
						<h2>
							{data.getUser
								? data.getUser.username
								: user.username}
							's Profile 👤
						</h2>
					</div>
					<div className="profile-details signup-login">
						<div className="nested-grid">
							<div className="col-one">Username:</div>
							<div>
								<strong>
									{data.getUser
										? data.getUser.username
										: user.username}
								</strong>
							</div>
						</div>
						<div className="nested-grid">
							<div className="col-one">Email:</div>
							<div>
								{data.getUser ? data.getUser.email : user.email}
							</div>
						</div>
						<div className="nested-grid">
							<div className="col-one">First Name:</div>
							<div>
								{data.getUser
									? data.getUser.firstName
									: user.firstName}
							</div>
						</div>
						<div className="nested-grid">
							<div className="col-one">Last Name:</div>
							<div>
								{data.getUser
									? data.getUser.lastName
									: user.lastName}
							</div>
						</div>
					</div>
					<div className="button-container">
						<MbButtonLink to="/">Back</MbButtonLink>
						<MbButtonLink to={`/profile/edit`}>Edit</MbButtonLink>
					</div>
				</div>
			</MbContainer>
		</div>
	);
}

export default Profile;
