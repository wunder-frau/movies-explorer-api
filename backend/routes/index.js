const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND } = require('../utils/error_messages');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const { authValid, loginValid } = require('../middlewares/validation');

const { login, logout, createUser } = require('../controllers/users');

router.post('/signup', authValid, createUser);

router.post('/signin', loginValid, login);

router.post('/signout', logout);

router.use('/', auth, userRouter);

router.use('/', auth, movieRouter);

router.all('*', () => {
  throw new NotFoundError(NOT_FOUND);
});

module.exports = router;
