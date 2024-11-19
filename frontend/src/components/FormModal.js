import React, { useState } from 'react';

const FormModal = ({ table, onClose }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert('Registro inserido com sucesso!');
        onClose();
      })
      .catch((err) => console.error('Erro ao inserir registro:', err));
  };

  return (
    <div className="modal">
      <h2>Inserir Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required />
        {table === 'alunos' && <input name="CPF" placeholder="CPF" onChange={handleChange} required />}
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default FormModal;
