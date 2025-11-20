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
					<Nav className="ms-auto navbar-custom"></Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
