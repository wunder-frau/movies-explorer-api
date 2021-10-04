const { NODE_ENV, JWT_SECRET, MONGO_DB } = process.env;

const constants = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  MONGO_DB: NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb',
};

module.exports = constants;
