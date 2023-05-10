import express from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import db from '../db/index.mjs';

/**
 * Page for register
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const renderRegisterPage = (req, res) => {
  res.locals.title = 'Register';

  res.render('users/register', { notLoggedIn: true });
};

/**
 * Page for login
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const renderLoginPage = (req, res) => {
  res.locals.title = 'Login';

  res.render('users/login', { notLoggedIn: true });
};

/**
 * Logout
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const logout = (req, res) => {
  req.flash('error', 'You logged out 😢!');

  res.redirect('/login');
};

/**
 * Login
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await db.read();
    const user = db.data.users.find((user) => user.username === username);
    if (!user) {
      req.flash('error', 'Invalid username or password 🔒');
      return res.redirect('/login');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid username or password 🔒');
      return res.redirect('/login');
    }

    req.flash('success', 'You logged in 😎!');

    req.session.user = { userId: user.id };

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

/**
 * Register
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const register = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.read();
    const existingUser = db.data.users.find((u) => u.username === username);
    if (existingUser) {
      req.flash('error', `User with username of ${username} already exist ☹️!`);
      return res.redirect('/register');
    }
    db.data.users.push({
      id: randomUUID(),
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });
    await db.write();

    req.flash('success', 'You registered successfully 😍!');

    res.redirect('/login');
  } catch (error) {
    next(error);
  }
};
