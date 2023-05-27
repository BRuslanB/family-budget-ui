import { useContext, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthContext from "../components/shared/AuthContext";

const Register = () => {
  const userEmail = useRef("");
  const firstName = useRef("");
  const lastName = useRef("");
  const birthDay = useRef("");
  const password = useRef("");
  const rePassword = useRef("");
  const {register}= useContext(AuthContext)
 
  const registerSubmit = async () => {
    let payload = {
      email: userEmail.current.value,
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      birthDay: birthDay.current.value,
      password: password.current.value,
      rePassword: rePassword.current.value
    }
    await register(payload);
  };
  
  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <legend>Registration Form</legend>
            <form>
              <Form.Group className="mb-2" controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" ref={userEmail} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" ref={firstName} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" ref={lastName} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBirthDay">
                <Form.Label>Birth Day</Form.Label>
                <Form.Control type="date" ref={birthDay} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={password} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formRePassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={rePassword} required />
              </Form.Group>
              <Button variant="primary" type="button" onClick={registerSubmit}>
                SIGN UP
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;