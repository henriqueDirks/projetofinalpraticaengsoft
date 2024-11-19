import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaUsers } from 'react-icons/fa'; 

const Table = ({ table, searchTerm, onEdit, onDelete, onViewRelated }) => {
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
        console.log('Dados recebidos:', data); // Debug para verificar os dados recebidos
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados:', err);
        setError(err.message);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!table) {
    return <p>Selecione uma tabela para visualizar os dados.</p>;
  }

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const isTurmas = table === 'turmas';
  const isAlunos = table === 'alunos';

  // Define colunas dinamicamente com base na tabela
  const columns = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== 'id' && key !== 'status')
    : [];

  // Adiciona a coluna "ações" para todas as tabelas
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
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) =>
                  col === 'ações' ? (
                    <td key={col}>
                      {/* Ícone para alterar */}
                      <FaEdit
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                        onClick={() => onEdit(row.id)}
                      />
                      {/* Ícone para excluir */}
                      <FaTrashAlt
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
                        onClick={() => onDelete(row.id)}
                      />
                      {/* Ícone para ver dados relacionados */}
                      {(isTurmas || isAlunos) && (
                        <FaUsers
                          style={{ cursor: 'pointer', color: 'green' }}
                          onClick={() =>
                            onViewRelated(
                              isTurmas ? 'alunos' : 'turmas',
                              row.id,
                              isTurmas ? `Alunos da turma ${row.turma}` : `Turmas do aluno ${row.nome}`
                            )
                          }
                        />
                      )}
                    </td>
                  ) : (
                    <td key={col}>{row[col]}</td>
                  )
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
