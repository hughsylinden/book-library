const bookController = require('../controllers/book');
const express = require('express');

const bookRouter = express.Router();

bookRouter.post('/', bookController.create);
bookRouter.get('/', bookController.read);
bookRouter.get('/:id', bookController.readOne);
bookRouter.patch('/:id', bookController.update);
bookRouter.delete('/:id', bookController.destroy);

module.exports = bookRouter;
