const DatabaseModel = require('../models/Model');

const Controller = {

  // Valida CPF seguindo as regras brasileiras
  validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    // Verifica se o CPF tem 11 dígitos ou se todos os números são iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      throw new Error('CPF inválido. Verifique e tente novamente.');
    }

    // Cálculo dos dígitos verificadores
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
      throw new Error('CPF inválido. Verifique e tente novamente.');
    }
  },

  // Valida comprimento máximo de campos
  validateFieldLength(field, maxLength) {
    if (field.length > maxLength) {
      throw new Error(`O campo ultrapassa o tamanho máximo permitido de ${maxLength} caracteres.`);
    }
  },

  // Valida campos obrigatórios de turmas
  validateTurmaFields(data) {
    const requiredFields = ['professores_id', 'salas_id', 'disciplinas_id'];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        throw new Error(`O campo ${field} é obrigatório.`);
      }
    });
  },

  async getAll(table, name = '', relatedId = null) {
    try {
      return await DatabaseModel.selectAll(table, name, relatedId);
    } catch (err) {
      throw new Error(`Erro ao buscar registros na tabela ${table}: ${err.message}`);
    }
  },

  async getAllInativos(table, name = '', relatedId = null) {
    try {
      return await DatabaseModel.selectAllInativos(table, name, relatedId);
    } catch (err) {
      throw new Error(`Erro ao buscar registros inativos na tabela ${table}: ${err.message}`);
    }
  },

  async insert(table, data) {
    try {
      return await DatabaseModel.insert(table, data);
    } catch (err) {
      throw new Error(`Erro ao inserir registro na tabela ${table}: ${err.message}`);
    }
  },

  async update(table, id, data) {
    try {
      return await DatabaseModel.update(table, id, data);
    } catch (err) {
      throw new Error(`Erro ao atualizar registro na tabela ${table}: ${err.message}`);
    }
  },

  async deactivate(table, id) {
    try {
      return await DatabaseModel.deactivate(table, id);
    } catch (err) {
      throw new Error(`Erro ao desativar registro na tabela ${table}: ${err.message}`);
    }
  },

  async activate(table, id) {
    try {
      return await DatabaseModel.activate(table, id);
    } catch (err) {
      throw new Error(`Erro ao reativar registro na tabela ${table}: ${err.message}`);
    }
  },

  async deleteRelation(alunos_id, turmas_id) {
    try {
      return await DatabaseModel.deleteRelation(alunos_id, turmas_id);
    } catch (err) {
      throw new Error(`Erro ao excluir relação: ${err.message}`);
    }
  },
};

module.exports = Controller;
