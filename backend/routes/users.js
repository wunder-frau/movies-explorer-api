const userRouter = require('express').Router();
const { updateUserValid } = require('../middlewares/validation');
const { getUser, updateUser } = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', updateUserValid, updateUser);

module.exports = userRouter;
