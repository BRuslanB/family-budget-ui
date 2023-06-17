import { useContext, useRef, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useUserContext } from "../components/shared/UserContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import AuthContext from "../components/shared/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const UserProfile = () => {
 
  const { userProfile, fetchUserProfile, updateProfile } = useUserContext();
  const { user, refreshToken } = useContext(AuthContext);
  const { formError, setFormError } = useFormErrorContext();
  const [selectedRoles, setSelectedRoles] = useState([]);

  const firstName = useRef("");
  const lastName = useRef("");
  const birthDay = useRef("");

  useEffect(() => {
    setFormError(""); // Clearing a previous form error when mounting a component
  }, []);

  // useEffect(() => {
  //   if (user && user.authorities) {
  //     setSelectedRoles(user.authorities);
  //   }
  // }, [user]);
  
  useEffect(() => {
    if (user && refreshToken && !userProfile) {
      fetchUserProfile();
    }

    if (user && user.authorities) {
      setSelectedRoles(user.authorities);
    }

    if (userProfile && firstName.current && lastName.current && birthDay.current) {
      firstName.current.value = userProfile.firstName || "";
      lastName.current.value = userProfile.lastName || "";
      birthDay.current.value = userProfile.birthDay || "";
    }
  }, [user, refreshToken, userProfile, fetchUserProfile]);

  // useEffect(() => {
  //   if (userProfile && firstName.current && lastName.current && birthDay.current) {
  //     firstName.current.value = userProfile.firstName || "";
  //     lastName.current.value = userProfile.lastName || "";
  //     birthDay.current.value = userProfile.birthDay || "";
  //   }
  // }, [userProfile, firstName.current, lastName.current, birthDay.current]);

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
      await updateProfile(payload);
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
                <Form.Control
                  type="text"
                  defaultValue={user?.sub}
                  readOnly
                  style={{ backgroundColor: "lightgray" }}
                />
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
              <Form.Group className="mb-2" controlId="formUserRoles">
                <Form.Label>Roles</Form.Label>
                {selectedRoles.map((role) => (
                  <Form.Check
                    key={role}
                    type="checkbox"
                    label={role}
                    checked={true}
                    disabled
                  />
                ))}
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