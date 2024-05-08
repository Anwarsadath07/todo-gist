import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; 


const BASE_URL=process.env.REACT_APP_BASE_URL
const TodoUpdate = () => {
  const { projectId, todoId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const [todo, setTodo] = useState(null); 
  const [description, setDescription] = useState(''); 
  const [status, setStatus] = useState('pending'); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); 
      return;
    }

    axios
      .get(`${BASE_URL}/projects/${projectId}/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        
        const fetchedTodo = response.data;
        setTodo(fetchedTodo);
        setDescription(fetchedTodo.description); 
        setStatus(fetchedTodo.status);
      })
      .catch((error) => {
        console.error('Error fetching todo:', error);
        setError('Could not fetch Todo');
      });
  }, [isLoggedIn, projectId, todoId, navigate]);

  const updateTodo = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/projects/${projectId}/todos/${todoId}`,
        {
          description,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update Todo');
    }
  };

  if (error) {
    return (
      <Container>
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!todo) {
    return (
      <Container>
        <Row>
          <Col className="text-center">
            <p>Loading...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mx-auto">
          <h2>Update Todo</h2>
          <Form onSubmit={updateTodo}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Update Todo
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoUpdate;
