import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import createJwtInterceptor from "../components/shared/jwtInterceptor";
import AuthContext from "../components/shared/AuthContext";

const FavouriteMovie = () => {
  const { user, refreshToken } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);

  console.log("userSub:", user.sub);
  console.log("refreshTokenUUID:", refreshToken.UUID);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
        const axiosInstance = interceptor;
        const response = await axiosInstance.get("http://localhost:8003/api/users/getuser");
        setMovies(response.data);
        console.log("movies=", movies)
      } catch (error) {
        console.error("Error fetching movies:", error);
        throw error; // Генерируем ошибку для передачи в jwtInterceptor
      }
    };

    fetchMovies();
  }, [user, refreshToken]);

  return (
    <>
      <Row xs={1} md={2} className="g-4">
        {movies.map((movie) => (
          <Card>
            <Card.Body>
              <Card.Title>{movie.email}</Card.Title>
              <Card.Text>Genre: {movie.firstName}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </>
  );
};

export default FavouriteMovie;