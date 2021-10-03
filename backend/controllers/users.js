const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = require('../utils/config');
const {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
  INVALID_CREDENTIALS,
  UNAUTHORIZED,
} = require('../utils/error_messages');

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => { throw new Error('notValidId'); })

    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new Error('notValidId'); })

    .then((_id) => res.send({ data: _id }))
    .catch(() => {
      throw new NotFoundError(NOT_FOUND);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  User.findOne({ email }).then((data) => {
    if (data) {
      throw new ConflictError(CONFLICT);
    }
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email,
        password: hash,
        name,
      }))
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        next(err);
      });
  })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => next(new NotFoundError(NOT_FOUND)))

    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ OK, token });
    })
    .catch((error) => {
      if (error.message === INVALID_CREDENTIALS) {
        next(new UnauthorizedError(UNAUTHORIZED));
      } else {
        next(error);
      }
    });
};

const logout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: 'JWT удалено из куки' });
  next();
};

module.exports = {
  getUsers,
  getUserId,
  getUser,
  createUser,
  updateUser,
  login,
  logout,
};
