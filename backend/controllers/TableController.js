// controllers/TableController.js
const Model = require('../models/Model');

const getAllData = (req, res) => {
  const { table } = req.params;
  Model.fetchAll(table, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

module.exports = { getAllData };
