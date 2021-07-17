const readerController = require('../controllers/reader');
const express = require('express');

const readerRouter = express.Router();

readerRouter.post('/', readerController.create);
readerRouter.get('/', readerController.read);
readerRouter.get('/:id', readerController.readOne);
readerRouter.patch('/:id', readerController.update);
readerRouter.delete('/:id', readerController.destroy);

module.exports = readerRouter;
