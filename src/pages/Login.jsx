import { useContext, useEffect, useState } from "react";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthContext from "../components/shared/AuthContext";

const Login = () => {
  
  const { formError, setFormError } = useFormErrorContext();
  const { login }= useContext(AuthContext)

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
 
  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loginSubmit();
    }
  };

  const loginSubmit = async () => {
    setFormError(""); // Clear previous form error

    if (userEmail.trim() === "" || password.trim() === "") {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        email: userEmail,
        password: password
      };
      await login(payload);
    }
  };
  
  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <legend>Login Form</legend>
            <form>
              <Form.Group className="mb-2" controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
              <Button className="button_style mt-2" onClick={loginSubmit}>
                SIGN IN
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;