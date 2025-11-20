import { useMutation, useQuery } from "@apollo/client/react";
import { GET_USER } from "../graphQL/queries/queries";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { UPDATE_USER } from "../graphQL/mutations/mutations";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import MbContainer from "../components/common/common/MbContainer";
import MbButton from "../components/common/common/MbButton";
import { toast } from "react-toastify";
import MbButtonLink from "../components/common/MbButtonLink";
import MbLoader from "../components/common/MbLoader";
import { useNavigate } from "react-router-dom";

function EditProfile() {
	const schema = Joi.object({
		username: Joi.string().min(3).max(50).required().lowercase(),
		// not doing password atm
		email: Joi.string().email().min(5).max(255).optional().allow(null),
		firstName: Joi.string().max(255).optional().allow(null),
		lastName: Joi.string().max(255).optional().allow(null),
	});

	const navigate = useNavigate();
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
			await saveUser({ ...getUser });
			// change to profile view
			navigate;
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
				</Card>
			</MbContainer>
		</div>
	);
}

export default EditProfile;
