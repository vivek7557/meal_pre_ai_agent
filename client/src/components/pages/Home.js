import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Home = () => {
  return (
    <Container>
      <Row className="text-center my-5">
        <Col>
          <h1 className="display-4">Enterprise Meal Prep</h1>
          <p className="lead">AI-powered meal planning for health-conscious professionals</p>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Personalized Meal Plans</Card.Title>
              <Card.Text>
                Get customized meal plans based on your dietary preferences, allergies, and nutritional goals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Grocery List Generator</Card.Title>
              <Card.Text>
                Automatically generate organized grocery lists to save time and reduce food waste.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Nutritional Tracking</Card.Title>
              <Card.Text>
                Track calories, macros, and other nutritional information for your meals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4 text-center">
        <Col>
          <LinkContainer to="/register">
            <Button variant="primary" size="lg">Get Started</Button>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;