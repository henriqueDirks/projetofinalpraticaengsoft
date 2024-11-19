import React, { useState } from 'react';
import Table from './Table';
import FormModal from './FormModal';
import ReactivationModal from './ReactivationModal';

const HomeView = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReactivationOpen, setIsReactivationOpen] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setReloadTable(!reloadTable); // Força a recarga da tabela ao trocar
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    setReloadTable(!reloadTable); // Força a atualização da tabela com o termo de pesquisa
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const toggleReactivation = () => {
    setIsReactivationOpen(!isReactivationOpen);
  };

  return (
    <div className="home-view">
      <header className="top-bar">
        <select onChange={handleTableChange}>
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
          onChange={handleSearchChange}
          disabled={!selectedTable}
        />
        <button onClick={handleSearchClick} disabled={!selectedTable}>
          Pesquisar
        </button>
        <button onClick={toggleForm} disabled={!selectedTable}>
          Inserir
        </button>
      </header>
      <main>
        {isFormOpen && (
          <FormModal table={selectedTable} onClose={toggleForm} />
        )}
        {isReactivationOpen && (
          <ReactivationModal table={selectedTable} onClose={toggleReactivation} />
        )}
        {!isFormOpen && !isReactivationOpen && selectedTable && (
          <Table
            table={selectedTable}
            searchTerm={searchTerm}
            reload={reloadTable}
          />
        )}
      </main>
      <button
        className="reactivate-button"
        onClick={toggleReactivation}
      >
        Reativar Itens
      </button>
    </div>
  );
};

export default HomeView;
