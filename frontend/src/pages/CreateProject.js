import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';

const BASE_URL=process.env.REACT_APP_BASE_URL

const CreateProject = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); 
    }
  }, [isLoggedIn, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/projects/`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/projects/${response.data._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorMessage('Failed to create the project. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <h2>Create a New Project</h2>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}
          <Form onSubmit={handleCreate}>
            <Form.Group controlId="projectTitle">
              <Form.Label>Project Title:</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Create Project
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProject;
