const express = require('express');
const router = express.Router();
const TableController = require('../controllers/TableController');

// Exemplo de rota
router.get('/:table', TableController.getAllData);

module.exports = router; // Certifique-se de exportar o router corretamente
const express = require('express');
const router = express.Router();
const TableController = require('../controllers/TableController');

// Certifique-se de que `TableController.getAllData` existe e está definido corretamente
router.get('/:table', TableController.getAllData);

module.exports = router;