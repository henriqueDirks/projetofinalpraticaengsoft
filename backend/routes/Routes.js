  const express = require('express');
  const router = express.Router();
  const Controller = require('../controllers/Controller');

  // Busca registros ativos ou relacionados
  router.get('/:table', async (req, res) => {
    const { table } = req.params;
    const { name, relatedId } = req.query; // Busca por nome ou registros relacionados
    try {
      const data = await Controller.getAll(table, name, relatedId);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Busca registros inativos
router.get('/:table/inativos', async (req, res) => {
  const { table } = req.params;
  const { name, relatedId } = req.query;
  try {
    const data = await Controller.getAllInativos(table, name, relatedId);
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

  // Excluir relação entre aluno e turma
  router.delete('/relations', async (req, res) => {
    const { alunos_id, turmas_id } = req.body;
    try {
      const result = await Controller.deleteRelation(alunos_id, turmas_id);
      res.status(200).json({ message: 'Relação excluída com sucesso.', result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  module.exports = router;
