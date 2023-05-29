import { useContext, useRef, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import createJwtInterceptor from "../components/shared/jwtInterceptor";
import AuthContext from "../components/shared/AuthContext";

const UserProfile = () => {
  const { user, refreshToken } = useContext(AuthContext);
  // const [userProfile, setUserProfile] = useState([]);
  // const userEmail = useRef("");
  
  const firstName = useRef("");
  const lastName = useRef("");
  const birthDay = useRef("");

  const fetchUser = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get("http://localhost:8003/api/users/getuser");
      const userData = response.data;
      if (userData) {
        firstName.current.value = userData.firstName || "";
        lastName.current.value = userData.lastName || "";
        birthDay.current.value = userData.birthDay || "";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user, refreshToken]);

  const fetchProfile = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put("http://localhost:8003/api/users/profile", payload);
      console.log("Profile saved:", response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const profileSubmit = async () => {
    const payload = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      birthDay: birthDay.current.value
    };
    await fetchProfile(payload);
  };

  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <legend>Profile Form</legend>
            <form>
              <Form.Group className="mb-2" controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" defaultValue={user?.sub} readOnly 
                  style={{ backgroundColor: "lightgray" }} />
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
              <Button className="button_style" onClick={profileSubmit}>
                SAVE
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;