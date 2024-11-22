import React, { useState, useEffect } from 'react';

const FormModal = ({ table, onClose, existingData = null, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Envia os dados para salvar
    onClose(); // Fecha o modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{existingData ? 'Editar Registro' : 'Inserir Registro'}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            key !== 'id' && key !== 'status' && ( // Não exibe ID e status
              <div key={key}>
                <label>{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                />
              </div>
            )
          ))}
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
