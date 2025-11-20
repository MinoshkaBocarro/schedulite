import { useMutation, useQuery } from "@apollo/client/react";
import { GET_USER } from "../graphQL/queries/queries";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { UPDATE_USER } from "../graphQL/mutations/mutations";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import MbContainer from "../../../done/common/MbContainer";
import MbButton from "../../../done/common/MbButton";
import { toast } from "react-toastify";
import MbButtonLink from "../../../done/common/MbButtonLink";

function Profile({ user, setUser }) {
	const userID = user.id;
	const [isEditing, setIsEditing] = useState(false);

	const { loading, error, data, refetch } = useQuery(GET_USER, {
		variables: { userID: userID },
		context: {
			headers: {
				authorization: user.token,
			},
		},
	});

	console.log("data");
	console.log(data);

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

	const schema = Joi.object({
		username: Joi.string().min(3).max(50).required().lowercase(),
		// not doing password atm
		email: Joi.string().email().min(5).max(255).optional().allow(null),
		firstName: Joi.string().max(255).optional().allow(null),
		lastName: Joi.string().max(255).optional().allow(null),
	});

	let userData = user;

	// Not doing password atm
	const onSubmit = async (formData) => {
		console.log("onsubmitwokring");
		try {
			const { username, email, firstName, lastName } = formData;
			await updateUser({
				variables: {
					updateUserID: userID,
					input: {
						username,
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
			await setUser({ ...getUser });
			// change to profile view
			setIsEditing(false);
		} catch (error) {
			toast.error(error.message);
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
			username: "",
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
				username: user.username,
				email: user.email || "",
				firstName: user.firstName || "",
				lastName: user.lastName || "",
			});
		}
	};

	const handleToggleEdit = () => {
		setIsEditing(true);
		populateForm();
	};

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
				{/* Ai gen - adjust and edit */}
				<Card
					className="p-4 shadow-sm"
					style={{ maxWidth: "600px", margin: "2rem auto" }}
				>
					<Card.Title className="profile-title d-flex justify-content-between align-items-center mb-4">
						<h2>{user.username}'s Profile 👤</h2>
						{!isEditing && (
							<MbButton onClick={handleToggleEdit}>Edit</MbButton>
						)}
					</Card.Title>

					<hr />

					{isEditing ? (
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
								<MbButton type="submit">Save Changes</MbButton>
							</div>
						</Form>
					) : (
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
									{data.getUser
										? data.getUser.email
										: user.email}
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
					)}
				</Card>
			</MbContainer>{" "}
		</div>
	);
}

export default Profile;
