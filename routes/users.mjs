import express from 'express';
import {
  login,
  logout,
  register,
  renderLoginPage,
  renderRegisterPage,
} from '../controllers/users.mjs';

const router = express.Router();

router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);
router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);

export default router;
