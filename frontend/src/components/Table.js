import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';

const Table = ({ table, searchTerm, status, onEdit, onToggleStatus }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [table, searchTerm, status]);

  const fetchData = () => {
    setIsLoading(true);
    const queryParam = `?status=${status}&name=${searchTerm}`;
    const url = `http://localhost:5000/api/${table}${queryParam}`;
    fetch(url)
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
      .then(() => fetchData()) // Atualiza os dados após desativar
      .catch((err) => console.error(err.message));
  };

  const handleReactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/activate`, { method: 'PATCH' })
      .then(() => fetchData()) // Atualiza os dados após reativar
      .catch((err) => console.error(err.message));
  };

  if (!table) return <p>Selecione uma tabela para visualizar os dados.</p>;

  if (isLoading) return <p>Carregando dados...</p>;

  if (error) return <p className="error-message">{error}</p>;

  const columns = data.length > 0 
    ? Object.keys(data[0]).filter((col) => col !== 'status') 
    : [];

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col.toUpperCase()}</th>
          ))}
          <th>AÇÕES</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
            <td>
              {status === 'ativo' ? (
                <>
                  <FaEdit onClick={() => onEdit(row)} />
                  <FaTrashAlt onClick={() => handleDeactivate(row.id)} />
                </>
              ) : (
                <FaCheck onClick={() => handleReactivate(row.id)} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
