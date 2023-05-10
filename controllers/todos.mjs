import express from 'express';
import { randomUUID } from 'crypto';
import db from '../db/index.mjs';

/**
 * Page for todos
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderTodosPage = async (req, res, next) => {
  try {
    const options = {
      title: 'Home',
    };
    const { userId } = req.query;

    await db.read();
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) {
      options.todos = [];
      options.userId = false;
      return res.render('index', options);
    }
    const userTodos = db.data.todos.filter((todo) => todo.userId === user.id);

    options.todos = userTodos;
    options.userId = user.id;

    res.render('index', options);
  } catch (error) {
    next(error);
  }
};

/**
 * Page for creating todo
 * @param {express.Request} req
 * @param {express.Response} res
 */

export const renderCreateTodoPage = (req, res) => {
  const options = {
    title: 'Create Todo',
  };
  const { userId } = req.query;

  options.userId = userId;

  res.render('todos/create', options);
};

/**
 * Page for updating todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderUpdateTodoPage = async (req, res, next) => {
  try {
    const options = {
      title: 'Update Todo',
    };
    const { userId } = req.query;
    const { todoId } = req.params;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);

    if (!todo) return res.sendStatus(404);

    options.todo = todo;
    options.userId = userId;

    res.render('todos/update', options);
  } catch (error) {
    next(error);
  }
};

/**
 * Create todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const createTodo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;

    await db.read();
    db.data.todos.push({
      id: randomUUID(),
      text,
      userId,
      completed: false,
    });
    await db.write();

    req.flash('success', 'Todo added 🧠 successfully!');

    res.redirect(`/?userId=${userId}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Update todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const updateTodo = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;
    const { text } = req.body;

    await db.read();
    let todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);
    if (!todo) {
      return res.sendcompleted(404);
    }
    todo.text = text;
    todo.userId = userId;
    await db.write();

    req.flash('success', 'Todo updated 🧠 successfully!');

    res.redirect(`/?userId=${userId}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const deleteTodo = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;
    console.log(req.params);

    await db.read();
    db.data.todos = db.data.todos.filter((todo) => !(todo.id === todoId && todo.userId === userId));
    await db.write();

    req.flash('error', 'Todo deleted 👀 successfully!');

    res.redirect(`/?userId=${userId}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const toggleTodo = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);
    if (!todo) {
      res.sendcompleted(404);
    }
    todo.completed = !todo.completed;
    await db.write();

    req.flash(
      todo.completed ? 'success' : 'error',
      `Todo ${todo.completed ? 'completed 🤩' : 'uncompleted 😏'} successfully!`
    );

    res.redirect(`/?userId=${userId}`);
  } catch (error) {
    next(error);
  }
};
