const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const movieRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const notFoundErrorRouter = require('./routes/notFoundError');
//const { authValid, loginValid } = require('./middlewares/validation');

//const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const Auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');

const app = express();
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const { PORT = 5000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin: 'https://wunder-frau.nomoredomains.club',
  optionsSuccessStatus: 204,
  preflightContinue: false,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

//app.post('/signin', loginValid, login);

//app.post('/signup', authValid, createUser);

app.use(Auth);
app.use('/', movieRouter);
app.use('/', userRouter);
app.use('/', authRouter); 


app.all('*', notFoundErrorRouter);
app.disable('x-powered-by');

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
