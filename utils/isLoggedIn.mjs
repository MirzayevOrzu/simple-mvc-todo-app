import db from '../db/index.mjs';

/**
 * Used to check if user is authenticated
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user) {
      req.flash('error', '401 Unauthorized');
      return res.redirect('/login');
    }

    const { userId } = req.session.user;
    await db.read();
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) {
      req.flash('error', '401 Unauthorized');
      return res.redirect('/login');
    }

    req.user = { userId };

    next();
  } catch (error) {
    next(error);
  }
};
