import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useUserContext } from "../components/shared/UserContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const UserPassword = () => {
  
  const { updatePassword } = useUserContext();
  const { formError, setFormError } = useFormErrorContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  
  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      passwordSubmit();
    }
  };

  const passwordSubmit = async () => {
    setFormError(""); // Clear previous form error

    if (currentPassword.trim() === "" ||
        newPassword.trim() === "" ||
        rePassword.trim() === "")
    {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        password: currentPassword,
        newPassword: newPassword,
        rePassword: rePassword
      };    
      await updatePassword(payload);
    }
  };

  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <legend>Password Update Form</legend>
            <form>
              <Form.Group className="mb-2" controlId="formCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formRePassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              {formError && <div className="text-danger">{formError}</div>}
              <Button className="button_style mt-2" onClick={passwordSubmit}>
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