import React, { useEffect, useState } from 'react';

const Table = ({ table, searchTerm, reload }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (table) {
      const url = searchTerm
        ? `/api/${table}/search?name=${searchTerm}`
        : `/api/${table}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error('Erro ao carregar dados:', err));
    }
  }, [table, searchTerm, reload]);

  const renderTable = () => {
    switch (table) {
      case 'alunos':
        return (
          <>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Regularidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.nome}</td>
                  <td>{row.CPF}</td>
                  <td>{row.regularidade}</td>
                  <td>
                    <button onClick={() => alert(`Alterar ID: ${row.id}`)}>
                      ✏️
                    </button>
                    <button onClick={() => alert(`Excluir ID: ${row.id}`)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );
      case 'disciplinas':
        return (
          <>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Período</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.nome}</td>
                  <td>{row.codigo}</td>
                  <td>{row.periodo}</td>
                  <td>
                    <button onClick={() => alert(`Alterar ID: ${row.id}`)}>
                      ✏️
                    </button>
                    <button onClick={() => alert(`Excluir ID: ${row.id}`)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );
      default:
        return <p>Selecione uma tabela válida.</p>;
    }
  };

  return (
    <div>
      <h2>Tabela: {table}</h2>
      <table>
        {renderTable()}
      </table>
    </div>
  );
};

export default Table;
