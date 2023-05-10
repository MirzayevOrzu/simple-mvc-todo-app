import express from 'express';
import { genValidator } from '../utils/genValidator.mjs';
import {
  login,
  logout,
  register,
  renderLoginPage,
  renderRegisterPage,
} from '../controllers/users.mjs';
import { userLoginSchema, userRegisterSchema } from '../schemas/user.mjs';

const router = express.Router();

/**
 * Validation middlewares
 */
const vLogin = genValidator(userLoginSchema, '/login');
const vRegister = genValidator(userRegisterSchema, '/register');

router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);
router.get('/logout', logout);
router.post('/login', vLogin, login);
router.post('/register', vRegister, register);

export default router;
