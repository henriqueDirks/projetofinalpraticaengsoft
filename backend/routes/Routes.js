const express = require('express');
const router = express.Router();
const Controller = require('../controllers/Controller');

// Rota para buscar todos os registros ativos
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  try {
    const data = await Controller.getAll(table);
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar registros por nome
router.get('/:table/search', async (req, res) => {
  const { table } = req.params;
  const { name } = req.query; // Nome passado como parâmetro de consulta (?name=João)
  try {
    const data = await Controller.searchByName(table, name);
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para inserir um novo registro
router.post('/:table', async (req, res) => {
  const { table } = req.params;
  const data = req.body; // Dados enviados no corpo da requisição
  try {
    const result = await Controller.insert(table, data);
    res.status(201).json({ message: `Registro inserido com sucesso na tabela ${table}.`, result });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
});

// Rota para atualizar um registro
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const data = req.body; // Dados enviados no corpo da requisição
  try {
    const result = await Controller.update(table, id, data);
    res.status(200).json({ message: `Registro atualizado com sucesso na tabela ${table}.`, result });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
});

// Rota para desativar um registro
router.patch('/:table/:id/deactivate', async (req, res) => {
  const { table, id } = req.params;
  try {
    const result = await Controller.deactivate(table, id);
    res.status(200).json({ message: `Registro desativado com sucesso na tabela ${table}.`, result });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para reativar um registro
router.patch('/:table/:id/activate', async (req, res) => {
  const { table, id } = req.params;
  try {
    const result = await Controller.activate(table, id);
    res.status(200).json({ message: `Registro reativado com sucesso na tabela ${table}.`, result });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
