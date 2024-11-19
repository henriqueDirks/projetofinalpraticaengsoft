import React, { useState, useEffect } from 'react';

const ReactivationModal = ({ table, onClose }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (table) {
      // Substitua esta parte pela sua chamada real de API
      fetch(`/api/${table}/inactive`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
    }
  }, [table]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Reativar Registros na Tabela {table}</h2>
        {table && (
          <table>
            <thead>
              <tr>
                {Object.keys(data[0] || {}).map((key) =>
                  key !== 'status' ? <th key={key}>{key}</th> : null
                )}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  {Object.entries(row).map(([key, value]) =>
                    key !== 'status' ? <td key={key}>{value}</td> : null
                  )}
                  <td>
                    <button onClick={() => alert(`Reativar ID: ${row.id}`)}>
                      Reativar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ReactivationModal;
