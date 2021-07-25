const genreController = require('../controllers/genre');
const express = require('express');

const genreRouter = express.Router();

genreRouter.post('/', genreController.create);
genreRouter.get('/', genreController.read);
genreRouter.get('/:id', genreController.readOne);
genreRouter.patch('/:id', genreController.update);
genreRouter.delete('/:id', genreController.destroy);

module.exports = genreRouter;
