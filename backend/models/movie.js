const mongoose = require('mongoose');
const validator = require('validator');

// Опишем схему:
const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEn: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', cardSchema);
