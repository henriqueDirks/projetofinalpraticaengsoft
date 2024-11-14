// backend/index.js
const express = require('express');
const cors = require('cors');
const tableRoutes = require('./routes/tableRoutes'); // Certifique-se de que este caminho está correto
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Define as rotas para acessar as tabelas
app.use('/api', tableRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
