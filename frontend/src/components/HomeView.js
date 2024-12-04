import React, { useState } from 'react';
import Table from './Table';
import FormModal from './FormModal';

const HomeView = () => {
  const [table, setTable] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('ativo'); // "ativo" ou "inativo"
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTableChange = (e) => {
    setTable(e.target.value);
    setSearchTerm('');
  };

  const toggleStatus = () => {
    setStatus(status === 'ativo' ? 'inativo' : 'ativo');
  };

  const handleSave = (formData) => {
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `http://localhost:5000/api/${table}/${formData.id}`
      : `http://localhost:5000/api/${table}`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Erro ao salvar registro.');
          });
        }
        alert('Registro salvo com sucesso.');
        setShowFormModal(false);
        fetchData(); // Atualiza a tabela após salvar
      })
      .catch((err) => setErrorMessage(err.message));
  };

  const fetchData = () => {
    setErrorMessage(''); // Limpa mensagens de erro ao recarregar
    // Atualiza a tabela ao mudar de status ou após salvar
  };

  return (
    <div className="home-view">
      <div className="top-bar">
        <select onChange={handleTableChange} value={table}>
          <option value="">Selecione uma tabela</option>
          <option value="alunos">Alunos</option>
          <option value="disciplinas">Disciplinas</option>
          <option value="professores">Professores</option>
          <option value="salas">Salas</option>
          <option value="turmas">Turmas</option>
        </select>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowFormModal(true)} disabled={!table}>
          Inserir
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {table && (
        <Table
          table={table}
          searchTerm={searchTerm}
          status={status}
          onEdit={(row) => {
            setEditingData(row);
            setShowFormModal(true);
          }}
          onToggleStatus={() => toggleStatus()}
        />
      )}
      <button onClick={toggleStatus} className="toggle-status">
        {status === 'ativo' ? 'Ver Inativos' : 'Ver Ativos'}
      </button>
      {showFormModal && (
        <FormModal
          table={table}
          onClose={() => {
            setShowFormModal(false);
            setEditingData(null);
          }}
          existingData={editingData}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default HomeView;
  