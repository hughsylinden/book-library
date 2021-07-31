const { Reader } = require('../models');
const controllerFunctions = require('../utils/controllerFunctions');

async function create(req, res) {
  controllerFunctions.createItem(req, res, Reader);
}

async function read(req, res) {
  controllerFunctions.readItems(req, res, Reader);
}

async function readOne(req, res) {
  controllerFunctions.readItem(req, res, Reader);
}

async function update(req, res) {
  controllerFunctions.updateItem(req, res, Reader);
}

async function destroy(req, res) {
  controllerFunctions.deleteItem(req, res, Reader);
}

module.exports = { create, read, readOne, update, destroy };
