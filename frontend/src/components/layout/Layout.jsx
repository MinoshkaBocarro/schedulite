import { Outlet } from "react-router-dom";

// Component Imports
import Footer from "./Footer";
import Header from "./Header";

function Layout({ user }) {
	return (
		<div id="app">
			<Header id="header" user={user} />
			<div id="app-content">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default Layout;
