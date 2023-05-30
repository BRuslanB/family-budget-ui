import { useContext, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import createJwtInterceptor from "../components/shared/jwtInterceptor";
import AuthContext from "../components/shared/AuthContext";

const UserPassword = () => {
  const { user, refreshToken } = useContext(AuthContext);
  const password = useRef("");
  const newPassword = useRef("");
  const rePassword = useRef("");
  const [formError, setFormError] = useState("");

  const updatePassword = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const payload = {
        password: password.current.value,
        newPassword: newPassword.current.value,
        rePassword: rePassword.current.value
      };
      const response = await axiosInstance.put(
        "http://localhost:8003/api/users/password",
        payload
      );
      console.log("Password updated:", response.data);
      alert(response.data.message); // Display the response messagee
      navigate("/");
    } catch (error) {
      console.error("Error updating password:", error);
      // Clear input fields
      password.current.value = "";
      newPassword.current.value = "";
      rePassword.current.value = "";
      setFormError(error.response.data.message);
    }
  };

  const passwordSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous form error
    if (
      password.current.value.trim() === "" ||
      newPassword.current.value.trim() === "" ||
      rePassword.current.value.trim() === ""
    ) {
      setFormError("Please fill in all the required fields.");
    } else {
      await updatePassword();
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