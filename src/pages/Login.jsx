import { useContext, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthContext from "../components/shared/AuthContext";

const Login = () => {
  const userEmail = useRef("");
  const password = useRef("");
  const {login}= useContext(AuthContext)
 
  const loginSubmit = async () => {
    let payload = {
      email: userEmail.current.value,
      password: password.current.value
    }
    await login(payload);
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
                <Form.Control type="text" ref={userEmail} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={password} required />
              </Form.Group>
              <Button className="button_style" onClick={loginSubmit}>
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