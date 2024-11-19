const express = require('express');
const router = express.Router();
const Controller = require('../controllers/Controller');

// Retorna todos os registros ativos
router.get('/:table', async (req, res) => {
    const { table } = req.params;
    const { name } = req.query; // Parâmetro opcional para busca por nome
    try {
      const data = await Controller.getAll(table, name);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Rota específica para "turmas"
router.get('/turmas', async (req, res) => {
    const { name } = req.query; // Parâmetro opcional para busca por nome
    try {
      const data = await Controller.getAll('turmas', name);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Insere um novo registro
router.post('/:table', async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  try {
    const result = await Controller.insert(table, data);
    res.status(201).json({ message: 'Registro inserido com sucesso.', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualiza um registro existente
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  try {
    const result = await Controller.update(table, id, data);
    res.status(200).json({ message: 'Registro atualizado com sucesso.', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Desativa um registro
router.patch('/:table/:id/deactivate', async (req, res) => {
  const { table, id } = req.params;
  try {
    const result = await Controller.deactivate(table, id);
    res.status(200).json({ message: 'Registro desativado com sucesso.', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reativa um registro
router.patch('/:table/:id/activate', async (req, res) => {
  const { table, id } = req.params;
  try {
    const result = await Controller.activate(table, id);
    res.status(200).json({ message: 'Registro reativado com sucesso.', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
