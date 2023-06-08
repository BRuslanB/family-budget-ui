import { useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useUserContext } from "../components/shared/UserContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const UserPassword = () => {
  
  const { updatePassword } = useUserContext();
  const { formError, setFormError } = useFormErrorContext();
  const password = useRef("");
  const newPassword = useRef("");
  const rePassword = useRef("");
  
  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  const passwordSubmit = async () => {
    const payload = {
      password: password.current.value,
      newPassword: newPassword.current.value,
      rePassword: rePassword.current.value
    };    
    setFormError(""); // Clear previous form error
    if (
      password.current.value.trim() === "" ||
      newPassword.current.value.trim() === "" ||
      rePassword.current.value.trim() === ""
    ) {
      setFormError("Please fill in all the required fields.");
    } else {
      await updatePassword(payload);
      // Clear input fields
      password.current.value = "";
      newPassword.current.value = "";
      rePassword.current.value = "";
    }
  };

  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <legend>Password Update Form</legend>
            <form>
              <Form.Group className="mb-2" controlId="formOldPassword">
                <Form.Label>Old Password</Form.Label>
                <Form.Control type="password" ref={password} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" ref={newPassword} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formRePassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={rePassword} />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
              <Button className="button_style" onClick={passwordSubmit}>
                UPDATE
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserPassword;