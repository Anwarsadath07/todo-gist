import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import axios from 'axios'

const BASE_URL=process.env.REACT_APP_BASE_URL

const Login = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isLoggedIn } = useContext(UserContext);

  useEffect(() =>{
    if(isLoggedIn){
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = {
      username,
      password,
    };

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, user);

      setIsLoggedIn(true);
      localStorage.setItem('token', response.data.token);

      navigate('/'); 
    } catch (error) {
      setError('Invalid credentials'); 
    }
  };

  return (
   
    <Container className="">
      <Row className="vh-90 d-flex flex-column align-items-center justify-content-center" >
        <Col className="" md={6}>
        
          <Form className='shadow p-3 rounded' onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && (
              <p className="text-danger text-center"> 
                {error}
              </p>
            )}
            <Form.Group controlId="username">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            

            <Button type="submit" variant="primary mt-3">Login</Button> {/* Login button */}
          </Form>

          <div className="mt-2 text-center">
            {/* <Button variant="link" onClick={() => navigate('/signup')}> 
              Don't have an account? Signup
            </Button> */}
           <p>Dont have an account?  <Link to={"/signup"}>Signup</Link></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
