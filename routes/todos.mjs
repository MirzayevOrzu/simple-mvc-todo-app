import express from 'express';
import {
  createTodo,
  deleteTodo,
  renderCreateTodoPage,
  renderTodosPage,
  renderUpdateTodoPage,
  toggleTodo,
  updateTodo,
} from '../controllers/todos.mjs';

const router = express.Router();

router.get('/', renderTodosPage);
router.get('/createTodo', renderCreateTodoPage);
router.get('/updateTodo/:todoId', renderUpdateTodoPage);
router.post('/todos/:userId/', createTodo);
router.post('/updateTodo/:userId/:todoId', updateTodo);
router.post('/deleteTodo/:userId/:todoId', deleteTodo);
router.post('/completeTodo/:userId/:todoId', toggleTodo);

export default router;
