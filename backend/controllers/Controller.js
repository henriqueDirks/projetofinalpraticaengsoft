const DatabaseModel = require('../models/Model');

const Controller = {
  async getAll(table, name, status) {
    try {
      return await DatabaseModel.selectAll(table, name, status);
    } catch (err) {
      throw new Error(`Erro ao buscar registros na tabela ${table}: ${err.message}`);
    }
  },

  validateCPF(cpf) {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos ou se todos os números são iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      throw new Error('CPF inválido. Verifique e tente novamente.');
    }

    // Cálculo dos dígitos verificadores
    const calcDigit = (cpfBase, factor) => {
      let total = 0;
      for (let i = 0; i < cpfBase.length; i++) {
        total += parseInt(cpfBase[i]) * factor--;
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const base = cpf.slice(0, 9); // Pega os primeiros 9 números
    const digit1 = calcDigit(base, 10); // Calcula o primeiro dígito verificador
    const digit2 = calcDigit(base + digit1, 11); // Calcula o segundo dígito verificador

    // Verifica se os dígitos verificadores calculados correspondem ao CPF informado
    if (cpf !== base + digit1 + digit2) {
      throw new Error('CPF inválido. Verifique e tente novamente.');
    }
  },

  // Validação do comprimento máximo de campos
  validateFieldLength(field, value, maxLength) {
    if (value && value.length > maxLength) {
      throw new Error(`O campo "${field}" ultrapassa o tamanho máximo permitido de ${maxLength} caracteres.`);
    }
  },

  // Inserir dados com validações
  async insert(table, data) {
    try {
      // Validações específicas para a tabela "alunos"
      if (table === 'alunos') {
        if (!data.CPF) throw new Error('O campo "CPF" é obrigatório.');
        this.validateCPF(data.CPF);
        this.validateFieldLength('nome', data.nome, 100);
        this.validateFieldLength('CPF', data.CPF, 11);
      }

      // Validações específicas para a tabela "disciplinas"
      if (table === 'disciplinas') {
        this.validateFieldLength('nome', data.nome, 100);
        this.validateFieldLength('codigo', data.codigo, 10);
        this.validateFieldLength('periodo', data.periodo, 2);
      }

      // Validações específicas para a tabela "professores"
      if (table === 'professores') {
        if (!data.CPF) throw new Error('O campo "CPF" é obrigatório.');
        this.validateCPF(data.CPF);
        this.validateFieldLength('nome', data.nome, 100);
        this.validateFieldLength('CPF', data.CPF, 11);
        this.validateFieldLength('titulacao', data.titulacao, 50);
      }

      // Validações específicas para a tabela "salas"
      if (table === 'salas') {
        this.validateFieldLength('nome', data.nome, 50);
        this.validateFieldLength('local', data.local, 100);
        if (data.capacidade && isNaN(data.capacidade)) {
          throw new Error('O campo "capacidade" deve ser numérico.');
        }
      }

      // Validações específicas para a tabela "turmas"
      if (table === 'turmas') {
        this.validateFieldLength('nome', data.nome, 100);
      }

      return await DatabaseModel.insert(table, data);
    } catch (err) {
      throw new Error(`Erro ao inserir registro na tabela "${table}": ${err.message}`);
    }
  },

  // Atualizar dados com validações
  async update(table, id, data) {
    try {
      // Validações específicas para a tabela "alunos"
      if (table === 'alunos') {
        if (data.CPF) this.validateCPF(data.CPF);
        if (data.nome) this.validateFieldLength('nome', data.nome, 100);
        if (data.CPF) this.validateFieldLength('CPF', data.CPF, 11);
      }

      // Validações específicas para a tabela "disciplinas"
      if (table === 'disciplinas') {
        if (data.nome) this.validateFieldLength('nome', data.nome, 100);
        if (data.codigo) this.validateFieldLength('codigo', data.codigo, 10);
        if (data.periodo) this.validateFieldLength('periodo', data.periodo, 2);
      }

      // Validações específicas para a tabela "professores"
      if (table === 'professores') {
        if (data.CPF) this.validateCPF(data.CPF);
        if (data.nome) this.validateFieldLength('nome', data.nome, 100);
        if (data.CPF) this.validateFieldLength('CPF', data.CPF, 11);
        if (data.titulacao) this.validateFieldLength('titulacao', data.titulacao, 50);
      }

      // Validações específicas para a tabela "salas"
      if (table === 'salas') {
        if (data.nome) this.validateFieldLength('nome', data.nome, 50);
        if (data.local) this.validateFieldLength('local', data.local, 100);
        if (data.capacidade && isNaN(data.capacidade)) {
          throw new Error('O campo "capacidade" deve ser numérico.');
        }
      }

      // Validações específicas para a tabela "turmas"
      if (table === 'turmas') {
        if (data.nome) this.validateFieldLength('nome', data.nome, 100);
      }

      return await DatabaseModel.update(table, id, data);
    } catch (err) {
      throw new Error(`Erro ao atualizar registro na tabela "${table}": ${err.message}`);
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

  // Buscar dados relacionados
  async getRelatedData(relatedTable, table, relatedId) {
    try {
      return await DatabaseModel.getRelatedData(relatedTable, table, relatedId);
    } catch (err) {
      throw new Error(`Erro ao buscar dados relacionados: ${err.message}`);
    }
  },

  // Buscar dados disponíveis para adicionar
  async getAvailableData(relatedTable, table, relatedId) {
    try {
      return await DatabaseModel.getAvailableData(relatedTable, table, relatedId);
    } catch (err) {
      throw new Error(`Erro ao buscar dados disponíveis: ${err.message}`);
    }
  },

  // Adicionar relacionamento
  async addRelation(alunos_id, turmas_id) {
    try {
      return await DatabaseModel.addRelation(alunos_id, turmas_id);
    } catch (err) {
      throw new Error(`Erro ao adicionar relação: ${err.message}`);
    }
  },

  // Remover relacionamento
  async deleteRelation(alunos_id, turmas_id) {
    try {
      return await DatabaseModel.deleteRelation(alunos_id, turmas_id);
    } catch (err) {
      throw new Error(`Erro ao excluir relação: ${err.message}`);
    }
  },

};

module.exports = Controller;
