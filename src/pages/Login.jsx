import { useContext, useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthContext from "../components/shared/AuthContext";

const Login = () => {
  
  const { formError, setFormError } = useFormErrorContext();
  const {login}= useContext(AuthContext)

  const userEmail = useRef("");
  const password = useRef("");
 
  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  const loginSubmit = async () => {
    let payload = {
      email: userEmail.current.value,
      password: password.current.value
    }
    setFormError(""); // Clear previous form error
      if (
        userEmail.current.value.trim() === "" ||
        password.current.value.trim() === ""
      ) {
        setFormError("Please fill in all the required fields.");
      } else {
        await login(payload);
        // Clear input fields
        userEmail.current.value = "";
        password.current.value = "";
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
                <Form.Control type="text" ref={userEmail} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={password} />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
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