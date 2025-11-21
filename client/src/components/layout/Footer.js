import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 p-4">
      <Container>
        <Row>
          <Col className="text-center">
            <h5>Enterprise Meal Prep</h5>
            <p>© {currentYear} Enterprise Meal Prep. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;