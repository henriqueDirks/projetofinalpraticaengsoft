import React, { useState } from 'react';
import Table from './Table';
import FormModal from './FormModal';
import ReactivationModal from './ReactivationModal';

const HomeView = () => {
  const [table, setTable] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);

  const handleTableChange = (e) => {
    setTable(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm);
  };

  return (
    <div>
      {/* Barra superior */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <select onChange={handleTableChange} style={{ marginRight: '10px' }}>
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
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch} disabled={!table}>
          Pesquisar
        </button>
        <button
          onClick={() => setShowFormModal(true)}
          disabled={!table}
          style={{ marginLeft: '10px' }}
        >
          Inserir
        </button>
      </div>

      {/* Tabela */}
      {table && <Table table={table} searchTerm={searchTerm} />}

      {/* Botão de Reativar */}
      <button
        onClick={() => setShowReactivationModal(true)}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        Reativar Itens
      </button>

      {/* Modais */}
      {showFormModal && <FormModal table={table} onClose={() => setShowFormModal(false)} />}
      {showReactivationModal && (
        <ReactivationModal table={table} onClose={() => setShowReactivationModal(false)} />
      )}
    </div>
  );
};

export default HomeView;
