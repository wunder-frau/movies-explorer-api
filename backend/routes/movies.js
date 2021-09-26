const movieRouter = require('express').Router();
const { movieIdValid, validateMovie } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovie, validateMovie);
movieRouter.delete('/:movieId', movieIdValid, deleteMovie);

module.exports = movieRouter;
