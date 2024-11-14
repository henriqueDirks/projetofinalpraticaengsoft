// src/components/Table.js
import React from 'react';

const Table = ({ data, search, table }) => {
  // Filtra os dados com base no termo de pesquisa
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row) => (
          <tr key={row.id}>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
            <td>
              <button onClick={() => {/* Lógica de alterar */}}>Alterar</button>
              <button onClick={() => {/* Lógica de excluir */}}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
