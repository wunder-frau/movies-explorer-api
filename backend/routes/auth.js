const authRouter = require('express').Router();
const { loginValid, authValid } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

authRouter.get('/signup', authValid, createUser);
authRouter.patch('/signin', loginValid, login);

module.exports = authRouter;