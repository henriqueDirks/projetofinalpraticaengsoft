const DatabaseModel = require('../models/Model');

const Controller = {
  validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      throw new Error('CPF inválido.');
    }
    const calcDigit = (base) => {
      let total = 0;
      for (let i = 0; i < base.length; i++) {
        total += parseInt(base.charAt(i)) * (base.length + 1 - i);
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };
    const base = cpf.slice(0, 9);
    const digit1 = calcDigit(base);
    const digit2 = calcDigit(base + digit1);
    if (cpf !== base + digit1 + digit2) {
      throw new Error('CPF inválido.');
    }
  },

  validateFieldLength(field, maxLength) {
    if (field.length > maxLength) {
      throw new Error(`Campo ultrapassa ${maxLength} caracteres.`);
    }
  },

  async getAll(table) {
    return await DatabaseModel.selectAll(table);
  },

  async searchByName(table, name) {
    return await DatabaseModel.selectAll(table, name);
  },

  async insert(table, data) {
    if (table === 'alunos' || table === 'professores') {
      this.validateCPF(data.CPF);
    }
    if (table === 'disciplinas') {
      this.validateFieldLength(data.codigo, 10);
    }
    return await DatabaseModel.insert(table, data);
  },

  async update(table, id, data) {
    if (table === 'alunos' || table === 'professores') {
      if (data.CPF) this.validateCPF(data.CPF);
    }
    if (table === 'disciplinas') {
      if (data.codigo) this.validateFieldLength(data.codigo, 10);
    }
    return await DatabaseModel.update(table, id, data);
  },

  async deactivate(table, id) {
    return await DatabaseModel.deactivate(table, id);
  },

  async activate(table, id) {
    return await DatabaseModel.activate(table, id);
  },
};

module.exports = Controller;
