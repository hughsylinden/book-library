const authorController = require('../controllers/author');
const express = require('express');

const authorRouter = express.Router();

authorRouter.post('/', authorController.create);
authorRouter.get('/', authorController.read);
authorRouter.get('/:id', authorController.readOne);
authorRouter.patch('/:id', authorController.update);
authorRouter.delete('/:id', authorController.destroy);

module.exports = authorRouter;
