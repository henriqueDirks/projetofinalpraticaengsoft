const connection = require('../db');

const DatabaseModel = {
  runQuery: (query, values) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  selectAll: (table, name = '', status = 'ativo') => {
    return new Promise((resolve, reject) => {
      let query = '';
      const values = [`%${name}%`, status];

      switch (table) {
        case 'turmas':
          query = `
            SELECT 
              turmas.id, turmas.nome AS turma_nome, turmas.dia_semana, 
              turmas.horario_inicio, turmas.horario_termino,
              professores.nome AS professor_nome, 
              salas.nome AS sala_nome, 
              disciplinas.nome AS disciplina_nome
            FROM turmas
            INNER JOIN professores ON turmas.professores_id = professores.id
            INNER JOIN salas ON turmas.salas_id = salas.id
            INNER JOIN disciplinas ON turmas.disciplinas_id = disciplinas.id
            WHERE turmas.nome LIKE ? AND turmas.status = ?
          `;
          break;

        case 'alunos':
          query = `
            SELECT 
              alunos.id, alunos.nome, alunos.CPF, 
              alunos.regularidade
            FROM alunos
            WHERE alunos.nome LIKE ? AND alunos.status = ?
          `;
          break;

        case 'disciplinas':
          query = `
            SELECT 
              disciplinas.id, disciplinas.nome, disciplinas.codigo, 
              disciplinas.periodo
            FROM disciplinas
            WHERE disciplinas.nome LIKE ? AND disciplinas.status = ?
          `;
          break;

        case 'professores':
          query = `
            SELECT 
              professores.id, professores.nome, professores.CPF,
              professores.titulacao
            FROM professores
            WHERE professores.nome LIKE ? AND professores.status = ?
          `;
          break;

        case 'salas':
          query = `
            SELECT 
              salas.id, salas.nome, salas.local, 
              salas.capacidade
            FROM salas
            WHERE salas.nome LIKE ? AND salas.status = ?
          `;
          break;

        default:
          return reject(new Error(`Tabela "${table}" não suportada.`));
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

   // Buscar relacionamentos entre alunos e turmas
   getRelatedData: (relatedTable, table, relatedId) => {
    return new Promise((resolve, reject) => {
      let query = '';
      const values = [relatedId];

      if (table === 'alunos' && relatedTable === 'turmas') {
        query = `
          SELECT 
            turmas.id, turmas.nome AS turma_nome, 
            salas.nome AS sala_nome, 
            turmas.horario_inicio, turmas.horario_termino,
            professores.nome AS professor_nome,
            disciplinas.nome AS disciplina_nome
          FROM turmaaluno
          INNER JOIN turmas ON turmaaluno.turmas_id = turmas.id
          INNER JOIN salas ON turmas.salas_id = salas.id
          INNER JOIN professores ON turmas.professores_id = professores.id
          INNER JOIN disciplinas ON turmas.disciplinas_id = disciplinas.id
          WHERE turmaaluno.alunos_id = ?;
        `;
      } else if (table === 'turmas' && relatedTable === 'alunos') {
        query = `
          SELECT 
            alunos.id, alunos.nome AS aluno_nome, 
            alunos.CPF, alunos.regularidade
          FROM turmaaluno
          INNER JOIN alunos ON turmaaluno.alunos_id = alunos.id
          WHERE turmaaluno.turmas_id = ?;
        `;
      }

      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Buscar dados disponíveis para adicionar relacionamentos
  getAvailableData: (relatedTable, table, relatedId) => {
    return new Promise((resolve, reject) => {
      let query = '';
      const values = [relatedId];

      if (table === 'alunos' && relatedTable === 'turmas') {
        query = `
          SELECT turmas.id, turmas.nome AS turma_nome
          FROM turmas
          WHERE turmas.id NOT IN (
            SELECT turmaaluno.turmas_id9
            FROM turmaaluno
            WHERE turmaaluno.alunos_id = ?
          );
        `;
      } else if (table === 'turmas' && relatedTable === 'alunos') {
        query = `
          SELECT alunos.id, alunos.nome AS aluno_nome
          FROM alunos
          WHERE alunos.id NOT IN (
            SELECT turmaaluno.alunos_id
            FROM turmaaluno
            WHERE turmaaluno.turmas_id = ?
          );
        `;
      }

      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  addRelation: (alunos_id, turmas_id) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO turmaaluno (alunos_id, turmas_id) VALUES (?, ?)`;
      connection.query(query, [alunos_id, turmas_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Remover relacionamento
  deleteRelation: (alunos_id, turmas_id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM turmaaluno WHERE alunos_id = ? AND turmas_id = ?`;
      connection.query(query, [alunos_id, turmas_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

};

module.exports = DatabaseModel;
