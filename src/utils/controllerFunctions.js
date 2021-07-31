const { Genre, Book, Author, Reader } = require('../models');
function removePassword(obj) {
  const nopwObj = obj;
  if ('password' in nopwObj) {
    delete nopwObj.password;
  }
  return nopwObj;
}

function createItem(req, res, model) {
  const data = req.body;
  model
    .create(data)
    .then((obj) => res.status(201).json(removePassword(obj.dataValues)))
    .catch((error) => {
      const [err] = error.errors;
      if (err.validatorKey == 'isEmail') {
        res.status(400).json({
          message: 'please provide a valid email address',
          error: err,
        });
      }
      if (err.validatorKey == 'len') {
        res.status(400).json({
          message: 'please make your password is at least 8 characters',
          error: err,
        });
      }
      if (err.validatorKey == 'is_null') {
        res.status(400).json({
          message: 'please make sure key values are provided',
          error: err,
        });
      }
      if (err.validatorKey == 'notEmpty') {
        res.status(400).json({
          message: 'empty key values are not permitted',
          error: err,
        });
      }
      res.status(500).send();
    });
}

function readItems(req, res, model) {
  let query = '';
  if (model.name === 'Book') {
    query = [Genre, Author, Reader];
  }
  if (
    model.name === 'Genre' ||
    model.name === 'Reader' ||
    model.name === 'Author'
  ) {
    query = Book;
  }
  model.findAll({ include: query }).then((items) => {
    const newArray = items.map((obj) => removePassword(obj.dataValues));
    res.status(200).json(newArray);
  });
}

function readItem(req, res, model) {
  let query = '';
  if (model.name === 'Book') {
    query = [Genre, Author, Reader];
  }
  if (
    model.name === 'Genre' ||
    model.name === 'Reader' ||
    model.name === 'Author'
  ) {
    query = Book;
  }
  model
    .findByPk(req.params.id, { include: query })
    .then((obj) => {
      if (!obj) {
        res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
      } else {
        res.status(200).json(removePassword(obj.dataValues));
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json(error)
    );
}

function updateItem(req, res, model) {
  model
    .update(req.body, { where: { id: req.params.id } })
    .then((updatedRows) => {
      if (updatedRows == 0) {
        throw Error;
      } else {
        res.status(200).json(`Number of updated rows: ${updatedRows}`);
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
    );
}

function deleteItem(req, res, model) {
  model
    .destroy({ where: { id: req.params.id } })
    .then((deletedRows) => {
      if (!deletedRows) {
        throw Error;
      } else {
        res.status(204).json(`Number of deleted rows: ${deletedRows}`);
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
    );
}

module.exports = { createItem, readItems, readItem, updateItem, deleteItem };
