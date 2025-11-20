// React Imports
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Page Imports
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp";
import EditEvent from "./pages/EditEvent";
import AddEvent from "./pages/AddEvent";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile.jsx";
import NotFound from "./pages/NotFound";

// Import Apollo CLient
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import AuthContext from "./context/authContext";
import { useContext } from "react";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://localhost:4000/",
	}),
	cache: new InMemoryCache(),
});

function App() {
	const { getCurrentUser } = useContext(AuthContext);
	const location = useLocation();

	function ProtectedRoute({ component: Component, ...rest }) {
		const user = getCurrentUser();
		console.log("location.state");
		console.log(location.state);
		if (!user) {
			return (
				<Navigate
					to="/login"
					state={{
						from: location,
						showNotLoggedInToast: location.state?.loggingOut
							? false
							: true,
					}}
					replace
				/>
			);
		}
		return <Component {...rest} />;
	}

	return (
		<div className="app">
			<ApolloProvider client={client}>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route
							index
							element={<ProtectedRoute component={Home} />}
						/>
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<SignUp />} />
						<Route
							path="event/add"
							element={<ProtectedRoute component={AddEvent} />}
						/>
						<Route
							path="event/edit/:eventID"
							element={<ProtectedRoute component={EditEvent} />}
						/>
						<Route
							path="profile"
							element={<ProtectedRoute component={Profile} />}
						/>
						<Route
							path="profile/edit/:profileID"
							element={<ProtectedRoute component={EditProfile} />}
						/>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ApolloProvider>
		</div>
	);
}

export default App;
