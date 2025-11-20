// React Hook Form and Joi
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// Apollo and graphQL
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER } from "../graphQL/mutations/mutations";

// React imports
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

// Toast import
import { toast } from "react-toastify";

// Component imports
import Title from "../components/common/Title";
import MbContainer from "../components/common/MbContainer";
import MbButton from "../components/common/MbButton";
import MbLoader from "../components/common/MbLoader";
import AuthContext from "../context/authContext";

function Login() {
	const { saveUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const schema = Joi.object({
		username: Joi.string().min(3).max(50).lowercase().required(),
		password: Joi.string().min(8).max(1024).required(),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: joiResolver(schema),
		defaultValues: { username: "", password: "" },
	});

	// Apollo Client Mutation
	const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

	const [errorMessage, setErrorMessage] = useState("");

	// Submit New User
	const onSubmit = async (data, event) => {
		event.preventDefault();
		const { username, password } = data;
		try {
			const result = await loginUser({
				variables: {
					input: {
						username,
						password,
					},
				},
			});
			console.log("result");
			console.log(result);
			saveUser(result.data.createUser);
			setErrorMessage("");
			navigate("/");
		} catch (error) {
			console.log("error");
			console.log(error.message);

			setErrorMessage(error.message);
		}
	};

	useEffect(() => {
		// Double pop up only in dev mode
		console.log(location.state);
		if (location.state && location.state.showNotLoggedInToast) {
			toast.warn("You are not logged in");
			navigate("/login", { replace: true });
		}
	}, [location.state]);

	useEffect(() => {
		if (errorMessage) {
			toast.error(errorMessage);
		}
	}, [errorMessage]);

	if (loading) {
		return <MbLoader />;
	}

	return (
		<div className="login-signup">
			<MbContainer>
				<Title>Login</Title>
				<div className="sign-in-up">
					<Form
						noValidate="NoValidate"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="username"
							control={control}
							render={({ field }) => (
								<Form.Group controlId="username">
									<Form.Label className="visually-hidden">
										Username
									</Form.Label>
									<Form.Control
										{...field}
										type="text"
										placeholder="Username"
										size="lg"
										className="form-shadow mb-2"
										isInvalid={errors.username}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.username?.message}
									</Form.Control.Feedback>
								</Form.Group>
							)}
						/>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<Form.Group
									controlId="password"
									className="mt-2"
								>
									<Form.Label className="visually-hidden">
										Password
									</Form.Label>
									<Form.Control
										{...field}
										type="password"
										placeholder="Password"
										size="lg"
										className="form-shadow"
										isInvalid={errors.password}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.password?.message}
									</Form.Control.Feedback>
								</Form.Group>
							)}
						/>
						<div className="button-container">
							<MbButton
								variant="dark"
								size="lg"
								block="true"
								className="w-100 mt-2"
								type="submit"
							>
								Login
								<i className="bi bi-send-fill"></i>
							</MbButton>
						</div>
					</Form>
					<p className="m-0 mt-1">
						Don't have an account?{" "}
						<Link to="/signup"> Sign up</Link> now!
					</p>
				</div>
			</MbContainer>
		</div>
	);
}

export default Login;
