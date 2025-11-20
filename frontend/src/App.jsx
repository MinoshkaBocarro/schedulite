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
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp";

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
								<Route
									index
									element={
										<ProtectedRoute component={Home} />
									}
								/>
								<Route path="login" element={<Login />} />
								<Route path="signup" element={<SignUp />} />
								<Route
									path="event/add"
									element={
										<ProtectedRoute
											component={AddEvent}
											user={user}
										/>
									}
								/>
								<Route
									path="event/edit/:eventID"
									element={
										<ProtectedRoute
											component={EditEvent}
											user={user}
										/>
									}
								/>
							</Route>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</AuthProvider>
				</ApolloProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
