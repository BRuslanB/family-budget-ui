import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useUserContext } from "../components/shared/UserContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import AuthContext from "../components/shared/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const UserProfile = () => {
 
  const { user } = useContext(AuthContext);
  const { userProfile, fetchUserProfile, updateProfile } = useUserContext();
  const { formError, setFormError } = useFormErrorContext();

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newBirthDay, setNewBirthDay] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    // Clearing a previous form error when mounting a component
    setFormError(""); 
    // Get User authorities list
    if (user && user.authorities) {
      setSelectedRoles(user.authorities);
    }
  }, []);

  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile();
    }
    // Get User profile fields
    console.log("UserProfile.userProfile", userProfile)
    if (userProfile) {
      setNewFirstName(userProfile.firstName);
      setNewLastName(userProfile.lastName);
      setNewBirthDay(userProfile.birthDay);
    }
  }, [userProfile, fetchUserProfile]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      profileSubmit();
    }
  };

  const profileSubmit = async () => {
    setFormError(""); // Clear previous form error

    if (newFirstName.trim() === "" ||
        newLastName.trim() === "" ||
        newBirthDay.trim() === "")
    {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        firstName: newFirstName,
        lastName: newLastName,
        birthDay: newBirthDay
      };
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
                  type="email"
                  defaultValue={user?.sub}
                  readOnly
                  style={{ backgroundColor: "lightgray" }}
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formUserLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formBirthDay">
                <Form.Label>Birth Day</Form.Label>
                <Form.Control
                    type="date"
                    value={newBirthDay}
                    onChange={(e) => setNewBirthDay(e.target.value)}
                    onKeyDown={handleKeyDown} // onKeyDown handler
                  />
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
              <Button className="button_style mt-2" onClick={profileSubmit}>
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