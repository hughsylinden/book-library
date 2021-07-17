const { Book } = require('../models');

async function create(req, res) {
  const data = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    ISBN: req.body.ISBN,
  };
  Book.create(data).then((book) => res.status(201).json(book));
}

async function read(req, res) {
  Book.findAll().then((book) => res.status(200).json(book));
}

async function readOne(req, res) {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (!book) {
        throw Error;
      } else {
        res.status(200).json(book);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The book could not be found.' })
    );
}

async function update(req, res) {
  Book.update(req.body, { where: { id: req.params.id } })
    .then((updatedRows) => {
      if (updatedRows == 0) {
        throw Error;
      } else {
        res.status(200).json(updatedRows);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The book could not be found.' })
    );
}

async function destroy(req, res) {
  Book.destroy({ where: { id: req.params.id } })
    .then((deletedRows) => {
      if (!deletedRows) {
        throw Error;
      } else {
        res.status(204).json(deletedRows);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The book could not be found.' })
    );
}

module.exports = { create, read, readOne, update, destroy };
