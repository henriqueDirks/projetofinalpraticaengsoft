const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/Routes');
//const turmasRoutes = require('./routes/turmas');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
//app.use('/api/turmas', turmasRoutes);
app.use('/api', routes);

// Middleware para lidar com rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
