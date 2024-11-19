const connection = require('../db');

const DatabaseModel = {
  // Consulta genérica para tabelas
  selectAll: (table, name = '') => {
    return new Promise((resolve, reject) => {
      const query = name
        ? `SELECT * FROM ${table} WHERE status = 'ativo' AND nome LIKE ?`
        : `SELECT * FROM ${table} WHERE status = 'ativo'`;
      const values = name ? [`%${name}%`] : [];

      console.log('Executando query (genérica):', query, values);
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Consulta específica para "turmas" com INNER JOIN
  selectAllTurmas: (name = '') => {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          turmas.nome AS turma,
          professores.nome AS professor,
          salas.nome AS sala,
          disciplinas.nome AS disciplina,
          turmas.dia_semana,
          turmas.horario_inicio,
          turmas.horario_termino
        FROM turmas
        INNER JOIN professores ON turmas.professores_id = professores.id
        INNER JOIN salas ON turmas.salas_id = salas.id
        INNER JOIN disciplinas ON turmas.disciplinas_id = disciplinas.id
        WHERE turmas.status = 'ativo'
      `;

      const values = name ? [`%${name}%`] : [];
      if (name) {
        query += ' AND turmas.nome LIKE ?';
      }

      console.log('Executando query (INNER JOIN):', query, values);
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = DatabaseModel;
