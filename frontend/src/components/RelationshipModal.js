import React, { useEffect, useState } from 'react';

const RelationModal = ({ title, relatedTable, relatedId, onClose }) => {
  const [relatedData, setRelatedData] = useState([]);
  const [availableData, setAvailableData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchRelatedData();
    fetchAvailableData();
  }, []);

  const fetchRelatedData = () => {
    fetch(`http://localhost:5000/api/${relatedTable}?relatedId=${relatedId}`)
      .then((response) => response.json())
      .then((data) => setRelatedData(data))
      .catch((err) => console.error(err));
  };

  const fetchAvailableData = () => {
    fetch(`http://localhost:5000/api/${relatedTable}?excludeId=${relatedId}`)
      .then((response) => response.json())
      .then((data) => setAvailableData(data))
      .catch((err) => console.error(err));
  };

  const handleAddRelation = () => {
    fetch('http://localhost:5000/api/relations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relatedId, selectedId }),
    })
      .then(() => fetchRelatedData())
      .catch((err) => console.error(err));
  };

  const handleDeleteRelation = (id) => {
    fetch(`http://localhost:5000/api/relations`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relatedId, id }),
    })
      .then(() => fetchRelatedData())
      .catch((err) => console.error(err));
  };

  return (
    <div className="modal">
      <h2>{title}</h2>
      <button onClick={onClose}>Fechar</button>
      <h3>Relacionados:</h3>
      <ul>
        {relatedData.map((item) => (
          <li key={item.id}>
            {item.nome}{' '}
            <button onClick={() => handleDeleteRelation(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <h3>Adicionar:</h3>
      <select onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Selecione</option>
        {availableData.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome}
          </option>
        ))}
      </select>
      <button onClick={handleAddRelation}>Adicionar</button>
    </div>
  );
};

export default RelationModal;
