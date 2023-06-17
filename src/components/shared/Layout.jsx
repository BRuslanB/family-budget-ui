import { useContext, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";


const Layout = ({ children }) => {

  const { user, refreshToken, logout } = useContext(AuthContext);

  useEffect(() => { 
    console.log("Layout.user", user)
    console.log("Layout.refreshToken", refreshToken)
  }, [user, refreshToken]);

  return (
    <>
      <Navbar className="bg_color_style" variant="dark">
        <Navbar.Brand>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {user && (
              <Nav.Link as={Link} to="/payments">
                Payments
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user && (
              <NavDropdown className="dropdown-menu-style" 
                title="Settings" id="nav-dropdown-settings">
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/categories">
                    Expense Category
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/expenses">
                    Expense
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/incomes">
                    Income
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/actors">
                    Actor
                </Dropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!user && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {user && (
              <NavDropdown className="dropdown-menu-style" 
                title={user?.fullname} id="nav-dropdown-user">
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/profile">
                    Edit Profile
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-style" 
                  as={Link} to="/password">
                    Change Password
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item className="dropdown-item-style" 
                  onClick={() => logout()}>
                    Logout
                </Dropdown.Item>
              </NavDropdown>
            )}
            {!user && (
              <Nav.Link as={Link} to="/register">
                Registration
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div style={{ minHeight: "440px", minWidth: "600px" }}>
        <Container className="p-0 m=0">{children}</Container>
      </div>
      <div className="row mt-2 py-2 bg_color_style">
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