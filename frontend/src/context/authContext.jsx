import { createContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import MbLoader from "../components/common/MbLoader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	// Define the context items
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);
	const location = useLocation();

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

	const saveUser = (user) => {
		setUser(user);
		saveTokenToLocalStorage(user);
	};

	// Check whether the user is logged in
	function getCurrentUser() {
		try {
			const userString = localStorage.getItem("user");
			const currentUser = JSON.parse(userString);

			return currentUser;
		} catch (error) {
			localStorage.setItem("user", "");

			return null;
		}
	}

	const handleLogout = () => {
		client.clearStore();
		localStorage.removeItem("user");
		setUser(null);
	};

	const value = {
		user,
		getCurrentUser,
		saveUser,
		handleLogout,
	};

	if (userLoading) {
		return <MbLoader />;
	}

	return (
		<AuthContext.Provider check={"check"} value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
