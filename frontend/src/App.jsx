// React Imports
import {
	Routes,
	Route,
	Navigate,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { useContext } from "react";

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

// Apollo CLient Import
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// Context Imports
import AuthContext from "./context/authContext";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://localhost:4000/",
	}),
	cache: new InMemoryCache(),
});

function App() {
	const { getCurrentUser, saveUser } = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();

	function ProtectedRoute({ component: Component, ...rest }) {
		const user = getCurrentUser();

		if (!user) {
			return (
				<Navigate
					to="/login"
					state={{
						from: location,
						showNotLoggedInToast: true ? false : true,
					}}
					replace
				/>
			);
		}
		return <Component {...rest} />;
	}

	const handleLogout = () => {
		client.clearStore();
		localStorage.removeItem("user");
		saveUser(null);
		navigate("login", {
			replace: true,
			state: { showNotLoggedInToast: false },
		});
	};

	return (
		<div className="app">
			<ApolloProvider client={client}>
				<Routes>
					<Route
						path="/"
						element={<Layout handleLogout={handleLogout} />}
					>
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
							path="profile/edit"
							element={<ProtectedRoute component={EditProfile} />}
						/>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</ApolloProvider>
		</div>
	);
}

export default App;
