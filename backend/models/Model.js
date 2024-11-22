const connection = require('../db');

const DatabaseModel = {
  selectAll: (table, name = '', relatedId = null) => {
    return new Promise((resolve, reject) => {
      let query = '';
      let values = [];

      switch (table) {
        case 'turmas':
          if (relatedId) {
            // Consulta para alunos relacionados a uma turma
            query = `
              SELECT alunos.id AS aluno_id, alunos.nome AS aluno_nome
              FROM turmaaluno
              INNER JOIN alunos ON turmaaluno.alunos_id = alunos.id
              WHERE turmaaluno.turmas_id = ? AND alunos.status = 'ativo';
            `;
            values = [relatedId];
          } else {
            // Consulta padrão para turmas
            query = `
              SELECT 
                turmas.id, turmas.nome AS turma,
                professores.nome AS professor,
                salas.nome AS sala,
                disciplinas.nome AS disciplina,
                turmas.dia_semana, turmas.horario_inicio, turmas.horario_termino
              FROM turmas
              INNER JOIN professores ON turmas.professores_id = professores.id
              INNER JOIN salas ON turmas.salas_id = salas.id
              INNER JOIN disciplinas ON turmas.disciplinas_id = disciplinas.id
              WHERE turmas.status = 'ativo'
            `;
            if (name) {
              query += ' AND turmas.nome LIKE ?';
              values.push(`%${name}%`);
            }
          }
          break;

        case 'alunos':
          if (relatedId) {
            // Consulta para turmas relacionadas a um aluno
            query = `
              SELECT turmas.id AS turma_id, turmas.nome AS turma_nome
              FROM turmaaluno
              INNER JOIN turmas ON turmaaluno.turmas_id = turmas.id
              WHERE turmaaluno.alunos_id = ? AND turmas.status = 'ativo';
            `;
            values = [relatedId];
          } else {
            // Consulta padrão para alunos
            query = name
              ? `SELECT * FROM ${table} WHERE status = 'ativo' AND nome LIKE ?`
              : `SELECT * FROM ${table} WHERE status = 'ativo'`;
            values = name ? [`%${name}%`] : [];
          }
          break;

        default:
          query = name
            ? `SELECT * FROM ${table} WHERE status = 'ativo' AND nome LIKE ?`
            : `SELECT * FROM ${table} WHERE status = 'ativo'`;
          values = name ? [`%${name}%`] : [];
          break;
      }

      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  selectAllInativos: (table, name = '', relatedId = null) => {
    return new Promise((resolve, reject) => {
      let query = '';
      let values = [];

      switch (table) {
        case 'turmas':
          if (relatedId) {
            // Consulta para alunos relacionados a uma turma
            query = `
              SELECT alunos.id AS aluno_id, alunos.nome AS aluno_nome
              FROM turmaaluno
              INNER JOIN alunos ON turmaaluno.alunos_id = alunos.id
              WHERE turmaaluno.turmas_id = ? AND alunos.status = 'inativo';
            `;
            values = [relatedId];
          } else {
            // Consulta padrão para turmas
            query = `
              SELECT 
                turmas.id, turmas.nome AS turma,
                professores.nome AS professor,
                salas.nome AS sala,
                disciplinas.nome AS disciplina,
                turmas.dia_semana, turmas.horario_inicio, turmas.horario_termino
              FROM turmas
              INNER JOIN professores ON turmas.professores_id = professores.id
              INNER JOIN salas ON turmas.salas_id = salas.id
              INNER JOIN disciplinas ON turmas.disciplinas_id = disciplinas.id
              WHERE turmas.status = 'inativo'
            `;
            if (name) {
              query += ' AND turmas.nome LIKE ?';
              values.push(`%${name}%`);
            }
          }
          break;

        case 'alunos':
          if (relatedId) {
            // Consulta para turmas relacionadas a um aluno
            query = `
              SELECT turmas.id AS turma_id, turmas.nome AS turma_nome
              FROM turmaaluno
              INNER JOIN turmas ON turmaaluno.turmas_id = turmas.id
              WHERE turmaaluno.alunos_id = ? AND turmas.status = 'inativo';
            `;
            values = [relatedId];
          } else {
            // Consulta padrão para alunos
            query = name
              ? `SELECT * FROM ${table} WHERE status = 'inativo' AND nome LIKE ?`
              : `SELECT * FROM ${table} WHERE status = 'inativo'`;
            values = name ? [`%${name}%`] : [];
          }
          break;

        default:
          query = name
            ? `SELECT * FROM ${table} WHERE status = 'inativo' AND nome LIKE ?`
            : `SELECT * FROM ${table} WHERE status = 'inativo'`;
          values = name ? [`%${name}%`] : [];
          break;
      }

      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  insert: (table, data) => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  update: (table, id, data) => {
    return new Promise((resolve, reject) => {
      const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];
      const query = `UPDATE ${table} SET ${updates} WHERE id = ?`;
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  deactivate: (table, id) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table} SET status = 'inativo' WHERE id = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  activate: (table, id) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table} SET status = 'ativo' WHERE id = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

// Excluir relação entre aluno e turma
deleteRelation: (alunos_id, turmas_id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM turmaaluno WHERE alunos_id = ? AND turmas_id = ?`;
    connection.query(query, [alunos_id, turmas_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
},

module.exports = DatabaseModel;
