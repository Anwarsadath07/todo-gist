const Project = require('../models/Project');
const Todo = require('../models/todo'); 
const axios = require('axios'); 

const createProject = async (req, res) => {
  try {
    const { title } = req.body;
    const newProject = new Project({
      title,
      owner: req.user._id, 
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};


const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};


const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};


const updateProject = async (req, res) => {
  try {
    const { title } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};


const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.remove(); 
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};


const addTodo = async (req, res) => {
  try {
    const { description } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newTodo = new Todo({ description });
    project.todos.push(newTodo);

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error adding todo', error: error.message });
  }
};


const updateTodo = async (req, res) => {
  try {
    const { description, status } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const todo = project.todos.id(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (description) {
      todo.description = description; 
    }

    if (status) {
      todo.status = status; 
    }

    todo.updated_date = new Date();

    await project.save();

    res.status(200).json({ message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
};


const deleteTodo = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const todoIndex = project.todos.findIndex((t) => t._id.toString() === req.params.todoId);

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    project.todos.splice(todoIndex, 1);
    await project.save(); 

    res.status(200).json({ message: 'Todo deleted', project });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
};
const getTodo = async (req, res) => {
  try {
    const { projectId, todoId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const todo = project.todos.id(todoId); 
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log(todo);

    res.status(200).json(todo); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error: error.message });
  }
};



const exportProjectAsGist = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const pendingTodos = project.todos.filter((todo) => todo.status === 'pending');
    const completedTodos = project.todos.filter((todo) => todo.status === 'complete');

    const gistContent = `
# ${project.title}

**Summary**: ${completedTodos.length} / ${project.todos.length} completed

## Pending Todos
${pendingTodos.map((todo) => `- [ ] ${todo.description}`).join('\n')}

## Completed Todos
${completedTodos.map((todo) => `- [x] ${todo.description}`).join('\n')}
`;

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Check this
};

// Logging headers and GitHub token
//console.log('Headers:', headers);
//console.log('GitHub Token:', process.env.GITHUB_TOKEN);

const response = await axios.post(
  'https://api.github.com/gists',
  {
    description: `${project.title} summary`,
    public: false,
    files: {
      [`${project.title}.md`]: {
        content: gistContent,
      },
    },
  },
  {
    headers,
  }
);

res.status(200).json({ gistUrl: response.data.html_url});
} catch (error) {
console.error('Error creating Gist:', error);
res.status(500).json({ message: 'Error exporting Gist', error: error.message });
}
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodo,
  exportProjectAsGist,
};
