import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';


const BASE_URL=process.env.REACT_APP_BASE_URL
const ProjectList = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/projects/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        navigate('/login'); 
      }
    };

    fetchProjects();
  }, [isLoggedIn, navigate]);

  return (
    <Container className=""> 
      <Row className="vh-90 d-flex flex-column align-items-center justify-content-center"> 
        <Col md={8}> 
        <h2 className='text-center mb-3 font-bold'>Project List</h2>
          <Card> 
            <Card.Body>
            
              {projects.length === 0 ? (
                <Alert variant="warning">No projects found</Alert> 
              ) : (
                <ol> 
                  {projects.map((project) => (
                    <li key={project._id}> 
                      <Link to={`/projects/${project._id}`}>{project.title}</Link> 
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-3 text-center"> 
                <Link to="/projects/new"> 
                  <Button variant="primary">Create New Project</Button> 
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectList;
