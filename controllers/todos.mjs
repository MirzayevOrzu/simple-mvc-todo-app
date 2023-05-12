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
    const { userId } = req.user;

    await db.read();
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) {
      options.todos = [];
      options.userId = false;
      return res.render('index', options);
    }
    const userTodos = db.data.todos.filter((todo) => todo.userId === user.id);

    res.locals.title = 'Home';

    res.render('index', { todos: userTodos, user });
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
  res.locals.title = 'Create Todo';

  res.render('todos/create');
};

/**
 * Page for updating todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderUpdateTodoPage = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);
    if (!todo) return res.sendStatus(404);

    res.locals.title = 'Update Todo';

    res.render('todos/update', { todo });
  } catch (error) {
    next(error);
  }
};

/**
 * Page for sharing todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

export const renderShareTodoPage = async (req, res, next) => {
  try {
    const { userId } = req.user;

    await db.read();
    const userTodos = db.data.todos.filter((todo) => todo.userId === userId);
    const sharableUsers = db.data.users.filter((user) => user.id !== userId);

    res.locals.title = 'Share Todo';

    res.render('todos/share', { todos: userTodos, users: sharableUsers });
  } catch (error) {
    next(error);
  }
};

/**
 * Page for viewing todos that you shared with others
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderYouSharedPage = async (req, res, next) => {
  try {
    const { userId } = req.user;

    await db.read();
    const userSharedTodos = db.data.todos
      .filter((todo) => todo.userId === userId && todo.sharedWith.length)
      .map((t) => ({
        ...t,
        sharedWithCount: t.sharedWith.length,
      }));

    res.locals.title = 'You Shared Todos';

    res.render('todos/you-shared', { todos: userSharedTodos });
  } catch (error) {
    next(error);
  }
};

/**
 * Page for viewing todos that othdrs shared with you
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderTheySharedPage = async (req, res, next) => {
  try {
    const { userId } = req.user;

    await db.read();
    const sharedWithUser = db.data.todos
      .filter((todo) => todo.sharedWith.includes(userId))
      .map((t) => {
        const owner = db.data.users.find((u) => u.id === t.userId);
        return {
          ...t,
          user: owner,
        };
      });

    res.locals.title = 'You Shared Todos';

    res.render('todos/they-shared', { todos: sharedWithUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Page for viewing todo's details
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const renderDetailsPage = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    await db.read();
    const todo = db.data.todos.find((todo) => todo.id === todoId && todo.userId && userId);
    if (!todo) {
      req.flash('error', 'Todo not found');
      return res.redirect('/');
    }
    const sharedUsers = db.data.users.filter((u) => todo.sharedWith.includes(u.id));

    res.locals.title = 'Todo details';
    console.log(todo);

    res.render('todos/show', { todo, users: sharedUsers });
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
    const { userId } = req.user;
    const { text } = req.body;

    await db.read();
    db.data.todos.push({
      id: randomUUID(),
      text,
      userId,
      completed: false,
      sharedWith: [],
    });
    await db.write();

    req.flash('success', 'Todo added 🧠 successfully!');

    res.redirect('/');
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
    const { userId } = req.user;
    const { todoId } = req.params;
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

    res.redirect('/');
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
    const { userId } = req.user;
    const { todoId } = req.params;

    await db.read();
    db.data.todos = db.data.todos.filter((todo) => !(todo.id === todoId && todo.userId === userId));
    await db.write();

    req.flash('error', 'Todo deleted 👀 successfully!');

    res.redirect('/');
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
    const { userId } = req.user;
    const { todoId } = req.params;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);
    if (!todo) {
      res.statusCode(404);
    }
    todo.completed = !todo.completed;
    await db.write();

    const type = todo.completed ? 'success' : 'error';
    const message = `Todo ${todo.completed ? 'completed 🤩' : 'uncompleted 😏'} successfully!`;
    req.flash(type, message);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

/**
 * Share todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const shareTodo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId, userId: sharedUserId } = req.body;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);

    if (!todo) {
      req.flash('error', 'Todo not found');
      return res.redirect('/shareTodo');
    }

    const sharedUser = db.data.users.find((u) => u.id === sharedUserId);

    if (!sharedUser) {
      req.flash('error', 'Shared user not found');
      return res.redirect('/shareTodo');
    }

    if (todo.sharedWith.includes(sharedUserId)) {
      req.flash('error', 'Todo is already shared with this user');
      return res.redirect('/shareTodo');
    }

    todo.sharedWith = [...todo.sharedWith, sharedUserId];
    await db.write();

    return res.redirect('/');
  } catch (error) {
    next(error);
  }
};

/**
 * Unshare todo
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const unShareTodo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId, userId: sharedUserId } = req.body;

    await db.read();
    const todo = db.data.todos.find((t) => t.id === todoId && t.userId === userId);

    if (!todo) {
      req.flash('error', 'Todo not found');
      return res.redirect(`todos/${todoId}`);
    }

    const sharedUser = db.data.users.find((u) => u.id === sharedUserId);

    if (!sharedUser) {
      req.flash('error', 'Shared user not found');
      return res.redirect(`/todos/${todoId}`);
    }

    if (!todo.sharedWith.includes(sharedUserId)) {
      req.flash('error', 'Todo is already not shared with this user');
      return res.redirect(`/todos/${todoId}`);
    }

    todo.sharedWith = todo.sharedWith.filter((uId) => uId !== sharedUserId);
    await db.write();

    req.flash('success', 'Successfully unshared!');

    return res.redirect(`/todos/${todoId}`);
  } catch (error) {
    next(error);
  }
};
