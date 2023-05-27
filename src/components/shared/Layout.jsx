import Navbar from "react-bootstrap/Navbar";
import { Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const Layout = ({ children }) => {
  const { user, refreshToken, logout } = useContext(AuthContext);
  console.log("user", user)
  console.log("refreshToken", refreshToken)
  
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {user && (
              <Nav.Link as={Link} to="/user-profile">
                User Profile
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!user && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {user && <Nav.Link href="#">{user?.fullname}</Nav.Link>}
            {!user && (
              <Nav.Link as={Link} to="/register">
                Registration
              </Nav.Link>
            )}
          </Nav>
          {user && (
            <Button
              variant="outline-success"
              type="button"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex justify-content-center" 
        style={{ minHeight: "600px", minWidth: "600px" }}>
        <Container>{children}</Container>
      </div>
      <div className="row mt-3 py-2 bg-primary">
          <div className="col-12 mx-auto">
            <p className="text-light text-center my-auto">
              Copyright &copy; 2023
            </p>
          </div>
      </div>
    </>
  );
};

export default Layout;