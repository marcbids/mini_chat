import React, { useContext, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { UserContext } from "../../userContext";
import { Userupdate } from "../Userupdate";
export const NavBar = () => {
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Mini-Chat</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className="ms-auto" style={{ maxHeight: "100px" }}>
            {user.id !== undefined ? (
              <>
                <NavDropdown
                  align="end"
                  id="end"
                  title={user.name}
                  menuVariant="light"
                >
                  <NavDropdown.Item onClick={(e) => setShow(true)}>
                    Update Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/signin">Sign In</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        <Userupdate show={show} setShow={setShow} data={user} />
      </Container>
    </Navbar>
  );
};
