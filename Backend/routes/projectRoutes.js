
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

const router = express.Router();


router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);
router.get('/:projectId', authMiddleware, projectController.getProjectById);
router.put('/:projectId', authMiddleware, projectController.updateProject);
router.delete('/:projectId', authMiddleware, projectController.deleteProject);


router.post('/:projectId/todos', authMiddleware, projectController.addTodo);
router.put('/:projectId/todos/:todoId', authMiddleware, projectController.updateTodo);
router.delete('/:projectId/todos/:todoId', authMiddleware, projectController.deleteTodo);
router.get('/:projectId/todos/:todoId',authMiddleware, projectController.getTodo)


router.post('/:projectId/export-gist', authMiddleware, projectController.exportProjectAsGist);

module.exports = router;
