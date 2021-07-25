function removePassword(obj) {
  const nopwObj = obj;
  if ('password' in nopwObj) {
    delete nopwObj.password;
  }
  return nopwObj;
}

function createItem(req, res, data, model) {
  model
    .create(data)
    .then((obj) => res.status(201).json(removePassword(obj.dataValues)))
    .catch((error) => {
      const [err] = error.errors;
      if (err.validatorKey == 'isEmail') {
        res.status(400).json({
          message: 'please provide a valid email address',
          error: err,
        });
      }
      if (err.validatorKey == 'len') {
        res.status(400).json({
          message: 'please make your password is at least 8 characters',
          error: err,
        });
      }
      if (err.validatorKey == 'is_null') {
        res.status(400).json({
          message: 'please make sure key values are provided',
          error: err,
        });
      }
      if (err.validatorKey == 'notEmpty') {
        res.status(400).json({
          message: 'empty key values are not permitted',
          error: err,
        });
      }
      res.status(500).send();
    });
}

function readItems(req, res, model) {
  model.findAll().then((items) => {
    const newArray = items.map((obj) =>    
      removePassword(obj.dataValues)
    )
    res.status(200).json(newArray)
  })
}

function readItem(req, res, model) {
  model
    .findByPk(req.params.id)
    .then((obj) => {
      if (!obj) {
        throw Error;
      } else {
        res.status(200).json(removePassword(obj.dataValues));
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
    );
}

function updateItem(req, res, model) {
  model
    .update(req.body, { where: { id: req.params.id } })
    .then((updatedRows) => {
      if (updatedRows == 0) {
        throw Error;
      } else {
        res.status(200).json(updatedRows);
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
    );
}

function deleteItem(req, res, model) {
  model
    .destroy({ where: { id: req.params.id } })
    .then((deletedRows) => {
      if (!deletedRows) {
        throw Error;
      } else {
        res.status(204).json(deletedRows);
      }
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: `The ${model.name.toLowerCase()} could not be found.` })
    );
}

module.exports = { createItem, readItems, readItem, updateItem, deleteItem };
