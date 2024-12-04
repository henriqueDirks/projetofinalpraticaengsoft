const express = require('express');
const router = express.Router();
const Controller = require('../controllers/Controller');

// Busca registros por status
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  const { name = '', status = 'ativo' } = req.query;

  try {
    const data = await Controller.getAll(table, name, status);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/:table/relations', async (req, res) => {
  const { relatedId } = req.query;
  try {
    const data = await Controller.getRelations(req.params.table, relatedId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/:table/relations', async (req, res) => {
  const { relatedId, id } = req.body;
  try {
    await Controller.deleteRelation(req.params.table, relatedId, id);
    res.status(200).send('Relacionamento excluído com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/:table/relations', async (req, res) => {
  const { relatedId, selectedId } = req.body;
  try {
    await Controller.addRelation(req.params.table, relatedId, selectedId);
    res.status(200).send('Relacionamento adicionado com sucesso.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Adicionar relação
router.post('/relations', async (req, res) => {
  const { alunos_id, turmas_id } = req.body;
  try {
    const result = await Controller.addRelation(alunos_id, turmas_id);
    res.status(201).json({ message: 'Relação adicionada com sucesso.', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

// Buscar dados relacionados
router.get('/:table/:relatedTable/:relatedId', async (req, res) => {
  const { table, relatedTable, relatedId } = req.params;
  try {
    const data = await Controller.getRelatedData(relatedTable, table, relatedId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar dados disponíveis para adicionar
router.get('/:table/:relatedTable/:relatedId/available', async (req, res) => {
  const { table, relatedTable, relatedId } = req.params;
  try {
    const data = await Controller.getAvailableData(relatedTable, table, relatedId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Remover relação
router.delete('/relations', async (req, res) => {
  const { alunos_id, turmas_id } = req.body;
  try {
    const result = await Controller.deleteRelation(alunos_id, turmas_id);
    res.status(200).json({ message: 'Relação removida com sucesso.', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
