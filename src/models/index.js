const sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const AuthorModel = require('./author');
const GenreModel = require('./genre');
const Sequelize = sequelize.Sequelize;
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  const Reader = ReaderModel(connection, sequelize);
  const Book = BookModel(connection, sequelize);
  const Author = AuthorModel(connection, sequelize);
  const Genre = GenreModel(connection, sequelize);

  connection.sync({ alter: true });
  return {
    Reader,
    Book,
    Author,
    Genre
  };
};

module.exports = setupDatabase();
