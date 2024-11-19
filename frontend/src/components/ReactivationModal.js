import React, { useEffect, useState } from 'react';

const ReactivationModal = ({ table, onClose }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/${table}/inactive`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Erro ao carregar dados:', err));
  }, [table]);

  const handleReactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/activate`, { method: 'PATCH' })
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert('Registro reativado com sucesso!');
      })
      .catch((err) => console.error('Erro ao reativar registro:', err));
  };

  return (
    <div className="modal">
      <h2>Itens Inativos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>
                <button onClick={() => handleReactivate(item.id)}>Reativar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default ReactivationModal;
