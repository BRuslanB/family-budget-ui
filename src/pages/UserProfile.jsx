import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import createJwtInterceptor from "../components/shared/jwtInterceptor";
import AuthContext from "../components/shared/AuthContext";

const UserProfile = () => {
  const { user, refreshToken } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);

  console.log("userFullName:", user.fullname);
  console.log("refreshTokenUUID:", refreshToken.UUID);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
        const axiosInstance = interceptor;
        const response = await axiosInstance.get("http://localhost:8003/api/users/getuser");
        setProfile(response.data);
        console.log("profile=", profile)
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error; // Генерируем ошибку для передачи в jwtInterceptor
      }
    };

    fetchProfile();
  }, [user, refreshToken]);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>{profile.email}</Card.Title>
          <Card.Text>First Name: {profile.firstName}</Card.Text>
          <Card.Text>Last Name: {profile.lastName}</Card.Text>
          <Card.Text>Birthday: {profile.birthDay}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserProfile;