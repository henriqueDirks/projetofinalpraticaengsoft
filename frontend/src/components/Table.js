import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaUsers } from 'react-icons/fa';

const Table = ({ table, searchTerm, status, onEdit, onViewRelated }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [table, searchTerm, status]);

  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/${table}?status=${status}&name=${searchTerm}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        return response.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleDeactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/deactivate`, { method: 'PATCH' })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao desativar registro.');
        fetchData(); // Atualiza a tabela
      })
      .catch((err) => setError(err.message));
  };

  const handleReactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/activate`, { method: 'PATCH' })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao reativar registro.');
        fetchData(); // Atualiza a tabela
      })
      .catch((err) => setError(err.message));
  };

  const renderActions = (row) => (
    <td>
      <FaEdit
        style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
        onClick={() => onEdit(row)}
      />
      {status === 'ativo' ? (
        <FaTrashAlt
          style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
          onClick={() => handleDeactivate(row.id)}
        />
      ) : (
        <FaUsers
          style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}
          onClick={() => handleReactivate(row.id)}
        />
      )}
      {(table === 'alunos' || table === 'turmas') && (
        <FaUsers
          style={{ cursor: 'pointer', color: 'green' }}
          onClick={() => onViewRelated(row.id)} // Ação de visualizar relacionamentos
        />
      )}
    </td>
  );

  if (!table) {
    return <p>Selecione uma tabela para visualizar os dados.</p>;
  }

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const columns = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== 'status') // Remove a coluna 'status' da exibição
    : [];

  if (data.length > 0) {
    columns.push('ações');
  }

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) =>
                  col === 'ações' ? renderActions(row) : <td key={col}>{row[col]}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>Nenhum dado encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
