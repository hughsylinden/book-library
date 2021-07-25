const { Genre } = require('../models');
const controllerFunctions = require('../utils/controllerFunctions');

async function create(req, res) {
  const data = {
    genre: req.body.genre,
  };
  controllerFunctions.createItem(req, res, data, Genre);
}

async function read(req, res) {
  controllerFunctions.readItems(req, res, Genre);
}

async function readOne(req, res) {
  controllerFunctions.readItem(req, res, Genre);
}

async function update(req, res) {
  controllerFunctions.updateItem(req, res, Genre);
}

async function destroy(req, res) {
  controllerFunctions.deleteItem(req, res, Genre);
}

module.exports = { create, read, readOne, update, destroy };
