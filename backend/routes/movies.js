const movieRouter = require('express').Router();
const { movieLinkValid, movieIdValid } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', movieLinkValid, createMovie);
movieRouter.delete('/:movieId', movieIdValid, deleteMovie);

module.exports = movieRouter;
