import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProvider from './context/UserContext';
import Navbar from './components/Navbar'; 
import TodoUpdate from './pages/TodoUpdate';
import "./App.css"

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects/:projectId/todos/:todoId/edit" element={<TodoUpdate/>} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
