// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { UserContext } from "../context/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Table,
// } from "react-bootstrap";
// import { formatDate } from "../utils/formatDate";
// import ProjectList from "./ProjectList";

// const ProjectDetail = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const { isLoggedIn } = useContext(UserContext);
//   const [project, setProject] = useState(null);
//   const [newTodo, setNewTodo] = useState("");
//   const [editTitle, setEditTitle] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`http://localhost:3000/projects/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => {
//         setProject(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching project:", error);
//         navigate("/login");
//       });
//   }, [projectId, isLoggedIn, navigate]);

//   const toggleEditTitle = () => {
//     setIsEditing((prev) => !prev);
//     setEditTitle(project.title);
//   };

//   const updateProjectTitle = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(
//         `http://localhost:3000/projects/${projectId}`,
//         { title: editTitle },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setProject((prevProject) => ({
//         ...prevProject,
//         title: editTitle,
//       }));
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating project title:", error);
//     }
//   };

//   const markTodoAsComplete = async (todoId) => {
//     try {
//       await axios.put(
//         `http://localhost:3000/projects/${projectId}/todos/${todoId}`,
//         { status: "complete" },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setProject((prevProject) => {
//         const updatedTodos = prevProject.todos.map((todo) =>
//           todo._id === todoId ? { ...todo, status: "complete" } : todo
//         );
//         return {
//           ...prevProject,
//           todos: updatedTodos,
//         };
//       });
//     } catch (error) {
//       console.error("Error marking todo as complete:", error);
//     }
//   };

//   const deleteTodo = async (todoId) => {
//     try {
//       await axios.delete(
//         `http://localhost:3000/projects/${projectId}/todos/${todoId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setProject((prevProject) => {
//         const updatedTodos = prevProject.todos.filter(
//           (todo) => todo._id !== todoId
//         );
//         return {
//           ...prevProject,
//           todos: updatedTodos,
//         };
//       });
//     } catch (error) {
//       console.error("Error deleting todo:", error);
//     }
//   };

//   const addTodo = async (e) => {
//     e.preventDefault();

//     if (newTodo.trim() === "") {
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:3000/projects/${projectId}/todos`,
//         {
//           description: newTodo.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setProject((prevProject) => ({
//         ...prevProject,
//         todos: [...prevProject.todos, response.data],
//       }));
//       setNewTodo("");
//     } catch (error) {
//       console.error("Error adding todo:", error);
//     }
//   };

//   const exportProjectAsGist = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/projects/${projectId}/export-gist`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       console.log(response.data.gistUrl);
//       // navigate(`/${response.data.gistUrl}`);
//       window.location.href = response.data.gistUrl;
//     } catch (error) {
//       console.error("Error exporting project to gist:", error);
//     }
//   };

//   if (!project) {
//     return (
//       <Container>
//         <Row>
//           <Col className="text-center">
//             <p>Loading...</p>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row>
//         <Col>
//           <Card>
//               <Card.Body>
//               <Row className="d-flex justify-content-between mb-4">
//                 <Col>
//                   <Link className="" to={"/"}>
//                     <Button>Back</Button>
//                   </Link>
//                 </Col>

//                 <Col md={6}>
//                 {isEditing ? (
//                   <Form.Control
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                 />
//                 ) : (
//                   <Card.Title className="text-center">{project.title}</Card.Title>
//                 )}
//                 </Col>

//                 <Col className="d-flex justify-content-end">
//                   {isEditing ? (
//                     <Form onSubmit={updateProjectTitle}>
                      
//                       <Button type="submit" variant="primary " className="">
//                         Save Title
//                       </Button>
//                     </Form>
//                   ) : (
//                     <>
                      
//                       <Button
//                         variant="primary"
//                         className=""
//                         onClick={toggleEditTitle}
//                       >
//                         Edit Title
//                       </Button>
//                     </>
//                   )}
//                 </Col>
//               </Row>
//               <Form onSubmit={addTodo}>
//                 <Form.Group>
//                   <Form.Label>Add Todo:</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={newTodo}
//                     onChange={(e) => setNewTodo(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Button type="submit" variant="primary mb-3 mt-2">
//                   Add Todo
//                 </Button>
//               </Form>

//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Todo</th>
//                       <th>Created Date</th>
//                       <th>Updated Date</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {project.todos.map((todo) => (
//                       <tr className="align-middle" key={todo._id}>
//                         <td>{todo.description}</td>
//                         <td>{formatDate(todo.created_date)}</td>
//                         <td>{formatDate(todo.updated_date)}</td>
//                         <td>{todo.status}</td>
//                         <td>
//                           <div className=" gap-3">
//                             {todo.status === "pending" && (
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 onClick={() => markTodoAsComplete(todo._id)}
//                               >
//                                 Mark as Complete
//                               </Button>
//                             )}
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="mx-3"
//                               onClick={() => deleteTodo(todo._id)}
//                             >
//                               Delete
//                             </Button>
//                             <Link
//                               to={`/projects/${project._id}/todos/${todo._id}/edit`}
//                             >
//                               <Button variant="outline-secondary" size="sm">
//                                 Update
//                               </Button>
//                             </Link>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>

//               <Button onClick={exportProjectAsGist} variant="success mt-3">
//                 Export Project to Gist
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ProjectDetail;



import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import { formatDate } from "../utils/formatDate";
import ProjectList from "./ProjectList";

const BASE_URL=process.env.REACT_APP_BASE_URL
const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fetchProjectData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchProjectData();
    const intervalId = setInterval(fetchProjectData, 100); 
    return () => clearInterval(intervalId); 
  }, [projectId, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
        navigate("/login");
      });
  }, [projectId, isLoggedIn, navigate]);

  const toggleEditTitle = () => {
    setIsEditing((prev) => !prev);
    setEditTitle(project.title);
  };

  const updateProjectTitle = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/projects/${projectId}`,
        { title: editTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProject((prevProject) => ({
        ...prevProject,
        title: editTitle,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project title:", error);
    }
  };

  const markTodoAsComplete = async (todoId) => {
    try {
      await axios.put(
        `${BASE_URL}/projects/${projectId}/todos/${todoId}`,
        { status: "complete" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProject((prevProject) => {
        const updatedTodos = prevProject.todos.map((todo) =>
          todo._id === todoId ? { ...todo, status: "complete" } : todo
        );
        return {
          ...prevProject,
          todos: updatedTodos,
        };
      });
    } catch (error) {
      console.error("Error marking todo as complete:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(
        `${BASE_URL}/projects/${projectId}/todos/${todoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProject((prevProject) => {
        const updatedTodos = prevProject.todos.filter(
          (todo) => todo._id !== todoId
        );
        return {
          ...prevProject,
          todos: updatedTodos,
        };
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();

    if (newTodo.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/todos`,
        {
          description: newTodo.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProject((prevProject) => ({
        ...prevProject,
        todos: [...prevProject.todos, response.data],
      }));
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const exportProjectAsGist = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/export-gist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data.gistUrl);
      window.location.href = response.data.gistUrl;
    } catch (error) {
      console.error("Error exporting project to gist:", error);
    }
  };

  if (!project) {
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
        <Col>
          <Card>
              <Card.Body>
              <Row className="d-flex justify-content-between mb-4">
                <Col>
                  <Link className="" to={"/"}>
                    <Button>Back</Button>
                  </Link>
                </Col>

                <Col md={6}>
                {isEditing ? (
                  <Form.Control
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                ) : (
                  <Card.Title className="text-center">{project.title}</Card.Title>
                )}
                </Col>

                <Col className="d-flex justify-content-end">
                  {isEditing ? (
                    <Form onSubmit={updateProjectTitle}>
                      
                      <Button type="submit" variant="primary " className="">
                        Save Title
                      </Button>
                    </Form>
                  ) : (
                    <>
                      
                      <Button
                        variant="primary"
                        className=""
                        onClick={toggleEditTitle}
                      >
                        Edit Title
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
              <Form onSubmit={addTodo}>
                <Form.Group>
                  <Form.Label>Add Todo:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary mb-3 mt-2">
                  Add Todo
                </Button>
              </Form>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Todo</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.todos.map((todo) => (
                      <tr className="align-middle" key={todo._id}>
                        <td>{todo.description}</td>
                        <td>{formatDate(todo.created_date)}</td>
                        <td>{formatDate(todo.updated_date)}</td>
                        <td>{todo.status}</td>
                        <td>
                          <div className=" gap-3">
                            {todo.status === "pending" && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => markTodoAsComplete(todo._id)}
                              >
                                Mark as Complete
                              </Button>
                            )}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mx-3"
                              onClick={() => deleteTodo(todo._id)}
                            >
                              Delete
                            </Button>
                            <Link
                              to={`/projects/${project._id}/todos/${todo._id}/edit`}
                            >
                              <Button variant="outline-secondary" size="sm">
                                Update
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Button onClick={exportProjectAsGist} variant="success mt-3">
                Export Project to Gist
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetail;




