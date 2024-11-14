const express = require('express');
const cors = require('cors');
const tableRoutes = require('./routes/tableRoutes'); // Certifique-se de que o caminho está correto
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Certifique-se de que `tableRoutes` está exportando uma função router corretamente
app.use('/api', tableRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
