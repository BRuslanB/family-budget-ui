import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthContext from "../components/shared/AuthContext";

const Register = () => {
  
  const { formError, setFormError } = useFormErrorContext();
  const {register}= useContext(AuthContext)

  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
 
  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  const registerSubmit = async () => {
    setFormError(""); // Clear previous form error

    if (userEmail.trim() === "" ||
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        birthDay.trim() === "" ||
        password.trim() === "" ||
        rePassword.trim() === "")
    {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        email: userEmail,
        firstName: firstName,
        lastName: lastName,
        birthDay: birthDay,
        password: password,
        rePassword: rePassword
      };
      await register(payload);
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
                <Form.Control
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBirthDay">
                <Form.Label>Birth Day</Form.Label>
                <Form.Control
                    type="date"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formRePassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
              <Button className="button_style mt-2" onClick={registerSubmit}>
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