import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext, useRef, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import createJwtInterceptor from "../components/shared/jwtInterceptor";
import AuthContext from "../components/shared/AuthContext";

const UserProfile = () => {
  const { user, refreshToken, setUser, setRefreshToken } = useContext(AuthContext);
  const firstName = useRef("");
  const lastName = useRef("");
  const birthDay = useRef("");
  const [formError, setFormError] = useState("");

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
  }, [user, refreshToken, setUser, setRefreshToken]);

  const fetchProfile = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8003/api/users/profile",
        payload
      );
      console.log("Profile saved:", response.data);
      alert(response.data.message); // Display the response messagee

      // Отправка запроса на обновление токенов
      const refreshResponse = await axios.post(
        "http://localhost:8003/api/auth/refreshtoken",
        {
          email: user?.sub,
          tokenUUID: refreshToken?.UUID
        },
        {
          headers: {
            "Refresh-Token": `Bearer ${refreshToken}`,
          },
        }
      );
      console.log("refreshResponse:", refreshResponse.data);

      // Обновление токенов в localStorage и в приложении
      localStorage.setItem("tokens", JSON.stringify(refreshResponse.data));
      setUser(jwt_decode(refreshResponse.data.access_token));
      setRefreshToken(jwt_decode(refreshResponse.data.refresh_token));
      navigate("/");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormError(error.response.data.message);
    }
  };
  
  const profileSubmit = async () => {
    const payload = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      birthDay: birthDay.current.value
    };
    setFormError(""); // Clear previous form error
    if (
      firstName.current.value.trim() === "" ||
      lastName.current.value.trim() === "" ||
      birthDay.current.value.trim() === ""
    ) {
      setFormError("Please fill in all the required fields.");
    } else {
      await fetchProfile(payload);
    }
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
              {formError && <div className="text-danger">{formError}</div>}
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