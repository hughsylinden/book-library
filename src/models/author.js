module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  };

  const AuthorModel = connection.define('Author', schema);
  return AuthorModel;
};
