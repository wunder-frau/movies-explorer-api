const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
// getUser, updateUser 
const { NODE_ENV, JWT_SECRET } = process.env;

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
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
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
      throw new ConflictError('Email уже существует');
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
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден.')))

    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
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
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно', token });
    })
    .catch((error) => {
      if (error.message === 'Неправильные почта или пароль') {
        next(new UnauthorizedError('Указан некорректный Email или пароль.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  getUser,
  createUser,
  updateUser,
  login,
};
