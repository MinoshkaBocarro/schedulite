import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import Icon from "@mdi/react";
import { mdiCalendarArrowRight } from "@mdi/js";
import { mdiAccountCircle } from "@mdi/js";

function Header({ user }) {
	return (
		<Navbar id="navbar" className="mb-2 navbar-class" variant="dark">
			<Container fluid>
				<Navbar.Brand as={Link} to="/">
					<Icon path={mdiCalendarArrowRight} size={2} />
					Schedulite
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto navbar-custom">
						{user ? (
							<Nav.Link
								as={Link}
								to="/profile"
								className="px-3 fs-5 align-items-center"
							>
								<span className="me-2">{user.username}</span>
								<Icon path={mdiAccountCircle} size={1} />
							</Nav.Link>
						) : (
							<>
								<Nav.Link
									as={Link}
									to="/signup"
									className="px-3 fs-5"
								>
									Sign Up
								</Nav.Link>
								<Nav.Link
									as={Link}
									to="/login"
									className="px-3 fs-5"
								>
									Log In
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
