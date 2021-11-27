const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const { MONGO_DB } = require('./utils/config');
const router = require('./routes/index');

const app = express();

require('dotenv').config();

const { PORT = 5000 } = process.env;

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin: 'https://api.wunder.movies.nomoredomains.club',
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

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT);
