const { Book } = require('../models');
const controllerFunctions = require('../utils/controllerFunctions');

async function create(req, res) {
  const data = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    ISBN: req.body.ISBN,
  };
  controllerFunctions.createItem(req, res, data, Book);
}

async function read(req, res) {
  controllerFunctions.readItems(req, res, Book);
}

async function readOne(req, res) {
  controllerFunctions.readItem(req, res, Book);
}

async function update(req, res) {
  controllerFunctions.updateItem(req, res, Book);
}

async function destroy(req, res) {
  controllerFunctions.deleteItem(req, res, Book);
}

module.exports = { create, read, readOne, update, destroy };
