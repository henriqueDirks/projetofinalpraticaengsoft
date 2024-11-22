import React, { useEffect, useState } from 'react';

const ReactivationModal = ({ table, onClose }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (table) {
      fetchInactiveItems();
    }
  }, [table]);

  const fetchInactiveItems = () => {
    setIsLoading(true);

    fetch(`http://localhost:5000/api/${table}?inactive=true`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleReactivate = (id) => {
    fetch(`http://localhost:5000/api/${table}/${id}/activate`, { method: 'PATCH' })
      .then(() => fetchInactiveItems()) // Atualiza lista após reativação
      .catch((err) => console.error(err.message));
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="modal">
      <h2>Reativar Itens</h2>
      <button onClick={onClose}>Fechar</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.nome}{' '}
            <button onClick={() => handleReactivate(item.id)}>Reativar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReactivationModal;
