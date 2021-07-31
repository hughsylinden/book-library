const { Author } = require('../models');
const controllerFunctions = require('../utils/controllerFunctions');

async function create(req, res) {
  controllerFunctions.createItem(req, res, Author);
}

async function read(req, res) {
  controllerFunctions.readItems(req, res, Author);
}

async function readOne(req, res) {
  controllerFunctions.readItem(req, res, Author);
}

async function update(req, res) {
  controllerFunctions.updateItem(req, res, Author);
}

async function destroy(req, res) {
  controllerFunctions.deleteItem(req, res, Author);
}

module.exports = { create, read, readOne, update, destroy };
