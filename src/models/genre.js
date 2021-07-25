module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };

  const GenreModel = connection.define('Genre', schema);
  return GenreModel;
};
