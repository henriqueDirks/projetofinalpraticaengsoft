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

  // Valida tamanho de campos
  validateFieldLength(field, maxLength) {
    if (field.length > maxLength) {
      throw new Error(`O campo ultrapassa o tamanho máximo permitido de ${maxLength} caracteres.`);
    }
  },

  // Busca todos os registros ativos
  async getAll(table, name = '') {
    try {
      if (table === 'turmas') {
        // Consulta para "turmas" com INNER JOIN
        return await DatabaseModel.selectAllTurmas(name);
      } else {
        // Consulta genérica para outras tabelas
        return await DatabaseModel.selectAll(table, name);
      }
    } catch (err) {
      throw new Error(`Erro ao buscar registros na tabela ${table}: ${err.message}`);
    }
  },

  // Inserir um novo registro com validações
  async insert(table, data) {
    try {
      // Validações específicas para tabelas
      if (table === 'alunos' || table === 'professores') {
        if (data.CPF) {
          this.validateCPF(data.CPF); // Valida CPF
        }
      }

      if (table === 'disciplinas') {
        if (data.codigo) {
          this.validateFieldLength(data.codigo, 10); // Valida tamanho do código
        }
      }

      if (table === 'turmas') {
        if (!data.professores_id || !data.salas_id || !data.disciplinas_id) {
          throw new Error('Os campos professores_id, salas_id e disciplinas_id são obrigatórios.');
        }
      }

      const result = await DatabaseModel.insert(table, data);
      return result;
    } catch (err) {
      throw new Error(`Erro ao inserir registro na tabela ${table}: ${err.message}`);
    }
  },

  // Atualizar um registro existente com validações
  async update(table, id, data) {
    try {
      // Validações específicas para tabelas
      if (table === 'alunos' || table === 'professores') {
        if (data.CPF) {
          this.validateCPF(data.CPF); // Valida CPF
        }
      }

      if (table === 'disciplinas') {
        if (data.codigo) {
          this.validateFieldLength(data.codigo, 10); // Valida tamanho do código
        }
      }

      if (table === 'turmas') {
        if (!data.professores_id || !data.salas_id || !data.disciplinas_id) {
          throw new Error('Os campos professores_id, salas_id e disciplinas_id são obrigatórios.');
        }
      }

      const result = await DatabaseModel.update(table, id, data);
      return result;
    } catch (err) {
      throw new Error(`Erro ao atualizar registro na tabela ${table}: ${err.message}`);
    }
  },

  // Desativar um registro
  async deactivate(table, id) {
    try {
      const result = await DatabaseModel.deactivate(table, id);
      return result;
    } catch (err) {
      throw new Error(`Erro ao desativar registro na tabela ${table}: ${err.message}`);
    }
  },

  // Reativar um registro
  async activate(table, id) {
    try {
      const result = await DatabaseModel.activate(table, id);
      return result;
    } catch (err) {
      throw new Error(`Erro ao reativar registro na tabela ${table}: ${err.message}`);
    }
  },
};

module.exports = Controller;
