import React, { useState } from 'react';

const FormModal = ({ table, onClose }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Enviando dados para a tabela ${table}:`, formData);
    onClose();
  };

  const renderFormFields = () => {
    switch (table) {
      case 'alunos':
        return (
          <>
            <label>Nome:</label>
            <input name="nome" onChange={handleInputChange} />
            <label>CPF:</label>
            <input name="CPF" onChange={handleInputChange} />
            <label>Regularidade:</label>
            <select name="regularidade" onChange={handleInputChange}>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
            </select>
          </>
        );
      case 'disciplinas':
        return (
          <>
            <label>Nome:</label>
            <input name="nome" onChange={handleInputChange} />
            <label>Código:</label>
            <input name="codigo" onChange={handleInputChange} />
            <label>Período:</label>
            <input name="periodo" onChange={handleInputChange} />
          </>
        );
      default:
        return <p>Tabela inválida.</p>;
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Inserir Dados na Tabela {table}</h2>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
