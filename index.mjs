import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.mjs';
import todoRouter from './routes/todos.mjs';

const app = express();
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(cookieParser('hey'));
app.use(
  session({
    cookie: { maxAge: 3_600_000 /* 1 hour */ },
    saveUninitialized: false,
    resave: false,
    secret: 'hey',
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.userId = null;
  res.locals.notLoggedIn = false;
  next();
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

app.use(userRouter);
app.use(todoRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
