import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col>
            <div className="image-container">
              <img className="image" 
                src="/images/family-budget-picture.jpg" alt="background image"/>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;