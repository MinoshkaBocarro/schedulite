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
import { AuthProvider } from "./context/authContext";

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://localhost:4000/",
	}),
	cache: new InMemoryCache(),
});

function App() {
	return (
		<div className="app">
			<BrowserRouter>
				<ApolloProvider client={client}>
					<AuthProvider>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route path="login" element={<Login />} />
							</Route>
						</Routes>
					</AuthProvider>
				</ApolloProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
