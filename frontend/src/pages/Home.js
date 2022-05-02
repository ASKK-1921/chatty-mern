import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

import "./Home.css";

function Home() {
  const user = useSelector((state) => state.user);
  return (
    <Row>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
          <h1>Share the world with your friends</h1>
          <p>Chat App lets you connect with the world.</p>
          {user && (
          <LinkContainer to="/chat">
            <Button variant="success">
              Get Started <i className="fas fa-comments home-message-icon" />
            </Button>
          </LinkContainer>
          )}
          {!user && (
          <LinkContainer to="/login">
            <Button variant="success">
              Get Started <i className="fas fa-comments home-message-icon" />
            </Button>
          </LinkContainer>
          )}
        </div>
      </Col>
      <Col md={6} className="home__bg"></Col>
    </Row>
  );
}

export default Home;
