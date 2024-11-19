const connection = require('../db');

const DatabaseModel = {
  selectAll: (table, name = '') => {
    return new Promise((resolve, reject) => {
      const query = name
        ? `SELECT * FROM ${table} WHERE status = 'ativo' AND nome LIKE ?`
        : `SELECT * FROM ${table} WHERE status = 'ativo'`;
      const values = name ? [`%${name}%`] : [];
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  selectInactive: (table) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE status = 'inativo'`;
      connection.query(query, (err, results) => {
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

module.exports = DatabaseModel;
