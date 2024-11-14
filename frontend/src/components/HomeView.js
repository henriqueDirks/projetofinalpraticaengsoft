// src/components/HomeView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import Form from './Form';

const HomeView = () => {
  const [table, setTable] = useState('');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [inactiveData, setInactiveData] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

  // Fetch data whenever the table selection changes
  useEffect(() => {
    if (table) {
      fetchData();
    }
  }, [table]);

  // Fetch active data from the selected table
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/${table}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch inactive data for reactivation
  const fetchInactiveData = async () => {
    try {
      const response = await axios.get(`/api/${table}/inativos`);
      setInactiveData(response.data);
      setShowInactive(true);
    } catch (error) {
      console.error("Error fetching inactive data:", error);
    }
  };

  // Handle table selection change
  const handleTableChange = (e) => {
    setTable(e.target.value);
    setShowForm(false);
    setShowInactive(false);
  };

  // Handle form display
  const handleInsertClick = () => {
    setShowForm(true);
  };

  return (
    <div>
      <header>
        <select onChange={handleTableChange} value={table}>
          <option value="">Selecione a Tabela</option>
          <option value="alunos">Alunos</option>
          <option value="disciplinas">Disciplinas</option>
          <option value="professores">Professores</option>
          <option value="salas">Salas</option>
          <option value="turmas">Turmas</option>
        </select>
        <input
          type="text"
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {table && (
          <button onClick={handleInsertClick}>Inserir</button>
        )}
      </header>

      {showForm && (
        <Form table={table} onClose={() => setShowForm(false)} />
      )}

      <Table data={data} search={search} table={table} />

      <button
        onClick={fetchInactiveData}
        style={{ position: 'fixed', bottom: 10, right: 10 }}
      >
        Reativar Itens
      </button>

      {showInactive && (
        <div>
          <h3>Itens Inativos</h3>
          {inactiveData.map((item) => (
            <div key={item.id}>
              <span>{item.nome}</span>
              <button onClick={() => {/* lógica de reativação */}}>Reativar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeView;
