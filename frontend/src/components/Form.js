// src/components/Form.js
import React, { useState } from 'react';

const Form = ({ table, onClose }) => {
  const [formData, setFormData] = useState({});

  // Manipula mudanças nos campos do formulário
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manipula a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui, você pode adicionar a lógica para salvar os dados no backend
    console.log(`Dados para salvar na tabela ${table}:`, formData);
    onClose(); // Fecha o formulário após o envio
  };

  return (
    <div>
      <h3>Inserir Dados na Tabela {table}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="nome" onChange={handleChange} required />
        </label>
        <label>
          CPF:
          <input type="text" name="cpf" onChange={handleChange} required />
        </label>
        {/* Adicione mais campos conforme necessário */}
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default Form;
