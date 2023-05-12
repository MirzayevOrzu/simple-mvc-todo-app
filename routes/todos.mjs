import express from 'express';
import { genValidator } from '../utils/genValidator.mjs';
import { isLoggedIn } from '../utils/isLoggedIn.mjs';
import {
  createTodo,
  deleteTodo,
  renderCreateTodoPage,
  renderShareTodoPage,
  renderTodosPage,
  renderUpdateTodoPage,
  toggleTodo,
  updateTodo,
  shareTodo,
  renderYouSharedPage,
  renderTheySharedPage,
  renderDetailsPage,
  unShareTodo,
} from '../controllers/todos.mjs';
import { todoCreateSchema, todoShareSchema } from '../schemas/todo.mjs';

const router = express.Router();

/**
 * Validation middlewares
 */
const vCreate = genValidator(todoCreateSchema, '/createTodo');
const vShare = genValidator(todoShareSchema, '/shareTodo');

router.get('/', isLoggedIn, renderTodosPage);
router.get('/createTodo', isLoggedIn, renderCreateTodoPage);
router.get('/updateTodo/:todoId', isLoggedIn, renderUpdateTodoPage);
router.get('/shareTodo', isLoggedIn, renderShareTodoPage);
router.get('/youShared', isLoggedIn, renderYouSharedPage);
router.get('/theyShared', isLoggedIn, renderTheySharedPage);
router.get('/todos/:todoId', isLoggedIn, renderDetailsPage);
router.post('/todos', isLoggedIn, vCreate, createTodo);
router.put('/todos/:todoId', isLoggedIn, updateTodo);
router.delete('/todos/:todoId', isLoggedIn, deleteTodo);
router.patch('/todos/toggle/:todoId', isLoggedIn, toggleTodo);
router.post('/todos/share', isLoggedIn, vShare, shareTodo);
router.post('/todos/unshare', isLoggedIn, vShare, unShareTodo);

export default router;
