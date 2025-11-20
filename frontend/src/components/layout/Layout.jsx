import { ToastContainer, Bounce } from "react-toastify";
import { Outlet } from "react-router-dom";

// Component Imports
import Footer from "./Footer";
import Header from "./Header";

function Layout({ user }) {
	return (
		<div id="app">
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Bounce}
			/>
			<Header id="header" user={user} />
			<div id="app-content">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default Layout;
