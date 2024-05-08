import React, { useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col} from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

const BASE_URL=process.env.REACT_APP_BASE_URL

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() =>{
    if(isLoggedIn){
      navigate('/')
    }
  }, [isLoggedIn, navigate])


  const registerUser = (event) => {
    event.preventDefault();

    const user = {
      username,
      email,
      password,
    };

    axios
      .post(`${BASE_URL}/users/signup`, user)
      .then((response) => {
        setErrorMessage('');
        navigate('/login'); 
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage('Failed to connect to the API'); 
        }
      });
  };

  return (
   

    <Container className=""> 
    <Row className="vh-90 d-flex flex-column align-items-center justify-content-center"> 
      <Col md={6}> 
            <Form  className="shadow p-3 rounded" onSubmit={registerUser}> 
            <h2>Signup</h2>
              <Form.Group controlId="username"> 
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {errorMessage && ( 
                <Alert variant="danger"> 
                  {errorMessage}
                </Alert>
              )}

              <Button type="submit"  className='mt-2' variant="primary">Signup</Button> 
            </Form>

            <div className="mt-2 text-center">
            {/* <Button variant="link" onClick={() => navigate('/signup')}> 
              Don't have an account? Signup
            </Button> */}
           <p>Already have an account?  <Link to={"/login"}>Login</Link></p>
          </div>
          
      </Col>
    </Row>
  </Container>
  );
};

export default Signup;
