import { createContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import MbLoader from "../components/common/MbLoader";

const UserContext = createContext();

export function AuthProvider({ children }) {
	// Define the context items
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);
	const navigate = useNavigate();

	// Call current user on every page mount
	useEffect(() => {
		const userData = getCurrentUser();
		setUser(userData);
		setTimeout(() => {
			setUserLoading(false);
		}, 2000);
	}, []);

	function saveTokenToLocalStorage(user) {
		localStorage.setItem("user", JSON.stringify(user));
	}

	const handleLogin = (user) => {
		setUser(user);
		saveTokenToLocalStorage(user);
	};

	// Check whether the user is logged in
	function getCurrentUser() {
		try {
			const token = getUserFromLocalStorage().token;
			const savedUser = jwtDecode(token);
			return savedUser;
		} catch (error) {
			return null;
		}
	}

	const handleLogout = () => {
		client.clearStore();
		localStorage.removeItem("user");
		setUser(null);
	};

	const getUserFromLocalStorage = () => {
		try {
			const userString = localStorage.getItem("user");
			const user = JSON.parse(userString);
			return user;
		} catch (error) {
			localStorage.setItem("user", "");
			return null;
		}
	};

	function ProtectedRoute({ component: Component, ...rest }) {
		const user = getUserFromLocalStorage();
		if (!user) {
			return <Navigate to="/login" replace />;
		}
		return <Component {...rest} />;
	}

	const value = { user, loginSaveUser, logout, getCurrentUser };

	if (userLoading) {
		return <MbLoader />;
	}

	return (
		<AuthProvider.Provider value={value}>{children}</AuthProvider.Provider>
	);
}
