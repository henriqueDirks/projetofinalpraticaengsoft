import React, { useEffect, useState } from 'react';

const Table = ({ table, searchTerm }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setIsLoading(true);

      // Adapta a URL para "turmas"
      const url =
        table === 'turmas'
          ? `http://localhost:5000/api/turmas` // Rota específica para turmas
          : `http://localhost:5000/api/${table}`; // Rota genérica para outras tabelas

      const queryParam = searchTerm ? `?name=${searchTerm}` : '';
      const fullUrl = url + queryParam;

      fetch(fullUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Dados recebidos:', data); // Log dos dados recebidos
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
    }
  }, [table, searchTerm]);

  if (!table) {
    return <p>Selecione uma tabela para visualizar os dados.</p>;
  }

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Colunas personalizadas para "turmas"
  const isTurmas = table === 'turmas';
  const customColumns = isTurmas
    ? ['turma', 'professor', 'sala', 'disciplina', 'dia_semana', 'horario_inicio', 'horario_termino']
    : data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== 'id' && key !== 'status')
    : [];

  return (
    <table>
      <thead>
        <tr>
          {customColumns.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index}>
              {customColumns.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={customColumns.length}>Nenhum dado encontrado.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
