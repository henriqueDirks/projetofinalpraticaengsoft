import React, { useState, useEffect } from 'react';

const RelationModal = ({ relatedTable, table, relatedId, onClose }) => {
  const [relatedData, setRelatedData] = useState([]);
  const [availableData, setAvailableData] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Alterna entre os modos "Relacionados" e "Adicionar"
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRelatedData();
  }, []);

  const fetchRelatedData = () => {
    fetch(`http://localhost:5000/api/${table}/${relatedTable}/${relatedId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar dados relacionados.');
        return response.json();
      })
      .then((data) => setRelatedData(data))
      .catch((err) => setErrorMessage(err.message));
  };

  const fetchAvailableData = () => {
    fetch(`http://localhost:5000/api/${table}/${relatedTable}/${relatedId}/available`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar dados disponíveis.');
        return response.json();
      })
      .then((data) => setAvailableData(data))
      .catch((err) => setErrorMessage(err.message));
  };

  const handleAddRelation = (id) => {
    const body =
      table === 'alunos'
        ? { alunos_id: relatedId, turmas_id: id }
        : { turmas_id: relatedId, alunos_id: id };
  
    fetch('http://localhost:5000/api/relations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Erro ao adicionar relacionamento.');
          });
        }
        alert('Relacionamento adicionado com sucesso.');
        fetchRelatedData(); // Atualiza os relacionados
        fetchAvailableData(); // Atualiza os disponíveis
        setIsAdding(false); // Retorna ao modo "Relacionados"
      })
      .catch((err) => setErrorMessage(err.message));
  };

  const handleDeleteRelation = (id) => {
    const body = table === 'alunos'
      ? { alunos_id: relatedId, turmas_id: id }
      : { turmas_id: relatedId, alunos_id: id };

    fetch('http://localhost:5000/api/relations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(() => fetchRelatedData())
      .catch((err) => setErrorMessage(err.message));
  };

  return (
    <div className="modal">
      <h2>{isAdding ? 'Adicionar Relacionamentos' : 'Relacionamentos Atuais'}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!isAdding ? (
        <>
          <h3>Relacionados:</h3>
          <table className="data-table">
            <thead>
              <tr>
                {table === 'alunos' ? (
                  <>
                    <th>Turma</th>
                    <th>Sala</th>
                    <th>Horário</th>
                    <th>Professor</th>
                    <th>Disciplina</th>
                    <th>Ações</th>
                  </>
                ) : (
                  <>
                    <th>Aluno</th>
                    <th>CPF</th>
                    <th>Regularidade</th>
                    <th>Ações</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {relatedData.map((item) => (
                <tr key={item.id}>
                  {table === 'alunos' ? (
                    <>
                      <td>{item.turma_nome}</td>
                      <td>{item.sala_nome}</td>
                      <td>{item.horario_inicio} - {item.horario_termino}</td>
                      <td>{item.professor_nome}</td>
                      <td>{item.disciplina_nome}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.aluno_nome}</td>
                      <td>{item.CPF}</td>
                      <td>{item.regularidade}</td>
                    </>
                  )}
                  <td>
                    <button onClick={() => handleDeleteRelation(item.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => { setIsAdding(true); fetchAvailableData(); }}>
            Adicionar
          </button>
        </>
      ) : (
        <>
          <h3>Disponíveis para Adicionar:</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {availableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.turma_nome || item.aluno_nome}</td>
                  <td>
                    <button onClick={() => handleAddRelation(item.id)}>Inserir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setIsAdding(false)}>Voltar</button>
        </>
      )}
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default RelationModal;
