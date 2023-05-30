import { useContext, useRef, useState } from "react";
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
  const [formError, setFormError] = useState("");
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
    setFormError(""); // Clear previous form error
    try {
      if (
        userEmail.current.value.trim() === "" ||
        firstName.current.value.trim() === "" ||
        lastName.current.value.trim() === "" ||
        birthDay.current.value.trim() === "" ||
        password.current.value.trim() === "" ||
        rePassword.current.value.trim() === ""
      ) {
        setFormError("Please fill in all the required fields.");
      } else {
        await register(payload);
      }
    } catch (error) {
      console.error("Error signin:", error);
      // Clear input fields
      userEmail.current.value = "";
      firstName.current.value = "";
      lastName.current.value = "";
      birthDay.current.value = "";
      password.current.value = "";
      rePassword.current.value = "";
      setFormError(error.response.data.message);
    }
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
                <Form.Control type="text" ref={userEmail} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" ref={firstName} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" ref={lastName} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBirthDay">
                <Form.Label>Birth Day</Form.Label>
                <Form.Control type="date" ref={birthDay} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={password} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formRePassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={rePassword} />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
              <Button className="button_style" onClick={registerSubmit}>
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