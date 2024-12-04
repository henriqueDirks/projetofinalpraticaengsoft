import React, { useState, useEffect } from 'react';

const FormModal = ({ table, onClose, existingData = null, onSave }) => {
  const [formData, setFormData] = useState({});
  const [relatedData, setRelatedData] = useState({
    professores: [],
    salas: [],
    disciplinas: [],
  });

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else {
      setFormData({});
    }
    if (table === 'turmas') {
      fetchRelatedData();
    }
  }, [existingData, table]);

  const fetchRelatedData = async () => {
    try {
      const [professores, salas, disciplinas] = await Promise.all([
        fetch('http://localhost:5000/api/professores?status=ativo').then((res) => res.json()),
        fetch('http://localhost:5000/api/salas?status=ativo').then((res) => res.json()),
        fetch('http://localhost:5000/api/disciplinas?status=ativo').then((res) => res.json()),
      ]);
      setRelatedData({ professores, salas, disciplinas });
    } catch (err) {
      console.error('Erro ao carregar dados relacionados:', err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderFields = () => {
    switch (table) {
      case 'turmas':
        return (
          <>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              required
            />
            <label>Professor</label>
            <select
              name="professores_id"
              value={formData.professores_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um professor</option>
              {relatedData.professores.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome}
                </option>
              ))}
            </select>
            <label>Sala</label>
            <select
              name="salas_id"
              value={formData.salas_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma sala</option>
              {relatedData.salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome}
                </option>
              ))}
            </select>
            <label>Disciplina</label>
            <select
              name="disciplinas_id"
              value={formData.disciplinas_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma disciplina</option>
              {relatedData.disciplinas.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.nome}
                </option>
              ))}
            </select>
            <label>Dia da Semana</label>
            <select
              name="dia_semana"
              value={formData.dia_semana || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o dia</option>
              <option value="Segunda">Segunda</option>
              <option value="Terça">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sábado">Sábado</option>
            </select>
            <label>Horário de Início</label>
            <input
              type="time"
              name="horario_inicio"
              value={formData.horario_inicio || ''}
              onChange={handleChange}
              required
            />
            <label>Horário de Término</label>
            <input
              type="time"
              name="horario_termino"
              value={formData.horario_termino || ''}
              onChange={handleChange}
              required
            />
          </>
        );
      case 'disciplinas':
        return (
          <>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              required
            />
            <label>Código</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo || ''}
              onChange={handleChange}
              required
            />
            <label>Período</label>
            <input
              type="number"
              name="periodo"
              value={formData.periodo || ''}
              onChange={handleChange}
              required
            />
          </>
        );
      case 'alunos':
        return (
          <>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              required
            />
            <label>CPF</label>
            <input
              type="text"
              name="CPF"
              value={formData.CPF || ''}
              onChange={handleChange}
              required
            />
            <label>Regularidade</label>
            <select
              name="regularidade"
              value={formData.regularidade || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
            </select>
          </>
        );
      default:
        return Object.keys(formData)
          .filter((key) => key !== 'status' && key !== 'id')
          .map((key) => ( 
            <div key={key}>
              <label>{key.toUpperCase()}</label>
              <input
                type="text"
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              />
            </div>
          ));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{existingData ? 'Editar Registro' : 'Inserir Registro'}</h2>
        <form onSubmit={handleSubmit}>
          {renderFields()}
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
