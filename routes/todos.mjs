import express from 'express';
import { genValidator } from '../utils/genValidator.mjs';
import { isLoggedIn } from '../utils/isLoggedIn.mjs';
import {
  createTodo,
  deleteTodo,
  renderCreateTodoPage,
  renderTodosPage,
  renderUpdateTodoPage,
  toggleTodo,
  updateTodo,
} from '../controllers/todos.mjs';
import { todoCreateSchema } from '../schemas/todo.mjs';

const router = express.Router();

/**
 * Validation middlewares
 */
const vCreate = genValidator(todoCreateSchema, '/createTodo');

router.get('/', isLoggedIn, renderTodosPage);
router.get('/createTodo', isLoggedIn, renderCreateTodoPage);
router.get('/updateTodo/:todoId', isLoggedIn, renderUpdateTodoPage);
router.post('/todos/:userId/', vCreate, createTodo);
router.put('/todos/:userId/:todoId', updateTodo);
router.delete('/todos/:userId/:todoId', deleteTodo);
router.patch('/todos/toggle/:userId/:todoId', toggleTodo);

export default router;
