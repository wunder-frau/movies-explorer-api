const movieRouter = require('express').Router();
const { movieIdValid, validateMovie } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', createMovie, validateMovie);
movieRouter.delete('/movies/:movieId', movieIdValid, deleteMovie);

module.exports = movieRouter;
