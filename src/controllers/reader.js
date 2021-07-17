const { Reader } = require('../models');

async function create(req, res) {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  Reader.create(data).then((reader) => res.status(201).json(reader));
}

async function read(req, res) {
  Reader.findAll().then((reader) => res.status(200).json(reader));
}

async function readOne(req, res) {
  Reader.findByPk(req.params.id)
    .then((reader) => {
      if (!reader) {
        throw Error;
      } else {
        res.status(200).json(reader);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The reader could not be found.' })
    );
}

async function update(req, res) {
  Reader.update(req.body, { where: { id: req.params.id } })
    .then((updatedRows) => {
      if (updatedRows == 0) {
        throw Error;
      } else {
        res.status(200).json(updatedRows);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The reader could not be found.' })
    );
}

async function destroy(req, res) {
  Reader.destroy({ where: { id: req.params.id } })
    .then((deletedRows) => {
      if (!deletedRows) {
        throw Error;
      } else {
        res.status(204).json(deletedRows);
      }
    })
    .catch(() =>
      res.status(404).json({ error: 'The reader could not be found.' })
    );
}

module.exports = { create, read, readOne, update, destroy };
