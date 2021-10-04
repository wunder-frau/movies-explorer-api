const Movie = require('../models/movie');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const { FORBIDDEN, NOT_FOUND } = require('../utils/error_messages');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => {
      res.send(data);
    })

    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((error) => {
      throw new BadRequestError(error.message);
    })

    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)

    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN);
      } else {
        Movie.findByIdAndDelete(req.params.movieId)
          .then((data) => {
            res.status(200).send(data);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
