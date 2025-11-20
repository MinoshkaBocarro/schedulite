// React Imports
// React Imports
import {
	Routes,
	Route,
	// Navigate,
	BrowserRouter,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Page Imports
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";

// Import Apollo CLient
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://localhost:4000/",
	}),
	cache: new InMemoryCache(),
});

function App() {
	const [user, setUser] = useState(null);

	function saveTokenToLocalStorage(user) {
		localStorage.setItem("user", JSON.stringify(user));
	}

	const handleLogin = (user) => {
		setUser(user);
		saveTokenToLocalStorage(user);
	};

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

	return (
		<div className="app">
			<BrowserRouter>
				<ApolloProvider client={client}>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route
								path="login"
								element={<Login onLogin={handleLogin} />}
							/>
						</Route>
					</Routes>
				</ApolloProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
