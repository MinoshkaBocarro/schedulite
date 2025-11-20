// React Imports
import { BrowserRouter } from "react-router-dom";

function App() {
	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
