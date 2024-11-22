import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaUsers } from 'react-icons/fa';

const Table = ({ table, searchTerm, onEdit, onDeactivate, onViewRelated }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (table) {
      fetchData();
    }
  }, [table, searchTerm]);

  const fetchData = () => {
    setIsLoading(true);

    const queryParam = searchTerm ? `?name=${searchTerm}` : '';
    const url = `http://localhost:5000/api/${table}${queryParam}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/deactivate`, { method: 'PATCH' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao desativar registro.');
        }
        alert('Registro desativado com sucesso.');
        fetchData(); // Atualiza a tabela após a desativação
      })
      .catch((err) => {
        console.error(err.message);
        alert('Erro ao desativar registro.');
      });
  };

  const renderActions = (row) => (
    <td>
      {/* Botão de Editar */}
      <FaEdit
        style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
        onClick={() => onEdit(row)}
      />
      {/* Botão de Desativar */}
      <FaTrashAlt
        style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
        onClick={() => handleDeactivate(row.id)}
      />
      {/* Botão de Ver Relacionados */}
      {(table === 'turmas' || table === 'alunos') && (
        <FaUsers
          style={{ cursor: 'pointer', color: 'green' }}
          onClick={() =>
            onViewRelated(
              table === 'turmas' ? 'alunos' : 'turmas',
              row.id,
              table === 'turmas'
                ? `Alunos da turma ${row.turma || row.nome}`
                : `Turmas do aluno ${row.nome}`
            )
          }
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
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const columns = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== 'id' && key !== 'status')
    : [];

  if (data.length > 0) {
    columns.push('ações');
  }

  return (
    <div>
      <table>
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
