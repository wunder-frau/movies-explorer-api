const authRouter = require('express').Router();
const { loginValid, authValid } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

authRouter.post('/signup', authValid, createUser);
authRouter.post('/signin', loginValid, login);

module.exports = authRouter;