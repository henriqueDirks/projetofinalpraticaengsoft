import React, { useState } from 'react';
import Table from './Table';
import FormModal from './FormModal';
import ReactivationModal from './ReactivationModal';

const HomeView = () => {
  const [table, setTable] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false); // Alterna entre ativos e inativos
  const [showFormModal, setShowFormModal] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Atualiza a tabela selecionada
  const handleTableChange = (e) => {
    setTable(e.target.value);
    setSearchTerm(''); // Limpa o termo de busca ao trocar de tabela
  };

  // Desativa um registro
  const handleDeactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/deactivate`, { method: 'PATCH' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao desativar registro.');
        }
        alert('Registro desativado com sucesso.');
      })
      .catch((err) => console.error(err.message));
  };

  // Reativa um registro
  const handleReactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/activate`, { method: 'PATCH' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao reativar registro.');
        }
        alert('Registro reativado com sucesso.');
      })
      .catch((err) => console.error(err.message));
  };

  // Salva o formulário (edição ou inserção)
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
          throw new Error('Erro ao salvar registro.');
        }
        alert('Registro salvo com sucesso.');
        setShowFormModal(false);
      })
      .catch((err) => console.error(err.message));
  };

  // Alterna entre registros ativos e inativos
  const toggleView = () => {
    setShowInativos(!showInativos);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Barra superior */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <select onChange={handleTableChange} value={table} style={{ marginRight: '10px' }}>
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
          style={{ marginRight: '10px', flex: 1 }}
        />
        <button
          onClick={() => {
            setEditingData(null);
            setShowFormModal(true);
          }}
          disabled={!table}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Inserir
        </button>
      </div>

      {/* Tabela */}
      {table && (
        <Table
          table={table}
          searchTerm={searchTerm}
          showInativos={showInativos}
          onEdit={(row) => {
            setEditingData(row);
            setShowFormModal(true);
          }}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
          onViewRelated={(relatedTable, id, title) =>
            console.log(`Ver ${relatedTable} relacionados com ID ${id} (${title})`)
          }
        />
      )}

      {/* Botão para alternar entre ativos e inativos */}
      <button
        onClick={toggleView}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: showInativos ? '#007bff' : '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {showInativos ? 'Voltar para Pesquisa' : 'Ver Inativos'}
      </button>

      {/* Modal de formulário */}
      {showFormModal && (
        <FormModal
          table={table}
          onClose={() => setShowFormModal(false)}
          existingData={editingData}
          onSave={handleSave}
        />
      )}

      {/* Modal de reativação */}
      {showReactivationModal && (
        <ReactivationModal
          table={table}
          onClose={() => setShowReactivationModal(false)}
          onReactivate={handleReactivate}
        />
      )}
    </div>
  );
};

export default HomeView;
