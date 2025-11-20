// React Imports
import { BrowserRouter } from "react-router-dom";

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
	return (
		<div className="app">
			<BrowserRouter>
				<ApolloProvider client={client}>
					<Routes>
						<Route path="/" element={<Layout />}></Route>
					</Routes>
				</ApolloProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
