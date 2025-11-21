// Apollo and GraphQL Imports
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_USER } from "../graphQL/queries/queries";
import { UPDATE_USER } from "../graphQL/mutations/mutations";

// React IMports
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Form Component Imports
import { Card, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// Component Imports
import MbContainer from "../components/common/MbContainer";
import MbButton from "../components/common/MbButton";
import { toast } from "react-toastify";
import MbButtonLink from "../components/common/MbButtonLink";
import MbLoader from "../components/common/MbLoader";
import AuthContext from "../context/authContext";
import { useState } from "react";

function EditProfile() {
	const schema = Joi.object({
		email: Joi.string().email().min(5).max(255).optional().allow(null, ""),
		firstName: Joi.string().max(255).optional().allow(null, ""),
		lastName: Joi.string().max(255).optional().allow(null, ""),
	});

	const navigate = useNavigate();

	const [submissionLoading, setSubmissionLoading] = useState(false);

	const { getCurrentUser, saveUser } = useContext(AuthContext);
	const user = getCurrentUser();
	const userID = user.id;

	const { loading, error, data, refetch } = useQuery(GET_USER, {
		variables: { userID: userID },
		context: {
			headers: {
				authorization: user.token,
			},
		},
	});

	const [updateUser] = useMutation(UPDATE_USER, {
		update(cache, { data: { updateUser } }) {
			const { getUser } = cache.readQuery({
				query: GET_USER,
				variables: { userID: userID },
			}) || { getUser: null };

			if (getUser) {
				cache.writeQuery({
					query: GET_USER,
					variables: { id: userID },
					data: { getUser: { ...user, ...updateUser } },
				});
			}
		},
	});

	// Not doing password atm
	const onSubmit = async (formData) => {
		setSubmissionLoading(true);
		try {
			const { email, firstName, lastName } = formData;
			await updateUser({
				variables: {
					updateUserID: userID,
					input: {
						email: email || null,
						firstName: firstName || null,
						lastName: lastName || null,
					},
					user: userID,
				},
				context: { headers: { authorization: `${user.token}` } },
			});
			const {
				data: { getUser },
			} = await refetch();
			await saveUser({ token: user.token, ...getUser });
			// change to profile view
			navigate("/profile");
		} catch (error) {
			toast.error(error.message);
			setTimeout(() => {
				setSubmissionLoading(false), 1000;
			});
		}
	};

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
		},
		resolver: joiResolver(schema),
	});

	const populateForm = () => {
		if (data && data.getUser) {
			const user = data.getUser;
			reset({
				email: user.email || "",
				firstName: user.firstName || "",
				lastName: user.lastName || "",
			});
		}
	};

	useEffect(() => {
		populateForm();
	}, []);

	if (loading) {
		return <MbLoader />;
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
						<h2>{user.username}'s Profile 👤</h2>
					</Card.Title>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										placeholder="Email"
										isInvalid={errors.email}
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email?.message}
								{console.log(errors)}{" "}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>First Name</Form.Label>
							<Controller
								name="firstName"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										placeholder="First Name"
										isInvalid={errors.firstName}
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.firstName?.message}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Last Name</Form.Label>
							<Controller
								name="lastName"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										placeholder="Last Name"
										isInvalid={errors.lastName}
									/>
								)}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.lastName?.message}
							</Form.Control.Feedback>
						</Form.Group>
						<div className="button-container">
							<MbButtonLink to="/">Back</MbButtonLink>
							<MbButton
								loadingState={submissionLoading}
								type="submit"
							>
								{submissionLoading ? (
									<Spinner
										animation="border"
										variant="light"
									/>
								) : (
									"Save Changes"
								)}
							</MbButton>
						</div>
					</Form>
				</Card>
			</MbContainer>
		</div>
	);
}

export default EditProfile;
