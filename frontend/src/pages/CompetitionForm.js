import React, { useState } from 'react';

function CompetitionForm({
    competitionName, setCompetitionName,
    competitionDate, setCompetitionDate,
    criteria, setCriteria,
    projects, setProjects,
    juryVoteCoefficient, setJuryVoteCoefficient
}) {
    const [newCriterion, setNewCriterion] = useState('');
    const [newCriterionCoefficient, setNewCriterionCoefficient] = useState(1);
    const [newCriterionDescription, setNewCriterionDescription] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    // Yeni kriter ekleme fonksiyonu
    const addCriterion = () => {
        if (newCriterion.trim()) {
            setCriteria([...criteria, {
                name: newCriterion.trim(),
                coefficient: Number(newCriterionCoefficient),
                description: newCriterionDescription.trim(),
            }]);
            setNewCriterion('');
            setNewCriterionCoefficient(1);
            setNewCriterionDescription('');
        }
    };

    // Mevcut kriterleri değiştirme fonksiyonu
    const handleCriterionChange = (index, field, value) => {
        const updatedCriteria = [...criteria];
        updatedCriteria[index][field] = field === 'coefficient' ? Number(value) : value;
        setCriteria(updatedCriteria);
    };

    // Kriter silme fonksiyonu
    const deleteCriterion = (index) => {
        setCriteria(criteria.filter((_, i) => i !== index));
    };

    // Yeni proje ekleme fonksiyonu
    const addProject = () => {
        if (newProjectName.trim() && newProjectDescription.trim()) {
            setProjects([
                ...projects,
                {
                    id: Date.now().toString(),
                    name: newProjectName.trim(),
                    description: newProjectDescription.trim(),
                },
            ]);
            setNewProjectName('');
            setNewProjectDescription('');
        } else {
            alert('Lütfen tüm alanları doldurun.');
        }
    };

    // Mevcut projeleri değiştirme fonksiyonu
    const handleProjectChange = (index, key, value) => {
        const updatedProjects = [...projects];
        updatedProjects[index] = {
            ...updatedProjects[index],
            [key]: value,
        };
        setProjects(updatedProjects);
    };

    // Proje silme fonksiyonu
    const deleteProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    return (
        <>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Adı:</label>
                <input
                    type="text"
                    value={competitionName}
                    onChange={(e) => setCompetitionName(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Tarihi:</label>
                <input
                    type="date"
                    value={competitionDate}
                    onChange={(e) => setCompetitionDate(e.target.value)}
                />
            </div>

            {/* Jüri Oy Katsayısı Alanı - Yeni eklendi */}
            <div style={{ marginBottom: '15px' }}>
                <label>Jüri Oy Katsayısı:</label>
                <input
                    type="number"
                    value={juryVoteCoefficient}
                    onChange={(e) => setJuryVoteCoefficient(Number(e.target.value))}
                    min="1"
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Kriterler</h3>
                <input
                    type="text"
                    placeholder="Kriter Adı"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Katsayı"
                    value={newCriterionCoefficient}
                    onChange={(e) => setNewCriterionCoefficient(e.target.value)}
                    min="1"
                    style={{ marginLeft: '10px', width: '80px' }}
                />
                <input
                    type="text"
                    placeholder="Kriter Açıklaması"
                    value={newCriterionDescription}
                    onChange={(e) => setNewCriterionDescription(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />
                <button onClick={addCriterion} style={{ marginTop: '10px' }}>
                    Kriter Ekle
                </button>
                <ul style={{ marginTop: '15px' }}>
                    {criteria.map((criterion, index) => (
                        <li key={index}>
                            <input
                                type="text"
                                value={criterion.name}
                                onChange={(e) => handleCriterionChange(index, 'name', e.target.value)}
                                style={{ width: '30%' }}
                            />
                            <input
                                type="number"
                                value={criterion.coefficient}
                                onChange={(e) => handleCriterionChange(index, 'coefficient', e.target.value)}
                                style={{ width: '80px', marginLeft: '10px' }}
                                min="1"
                            />
                            <input
                                type="text"
                                value={criterion.description}
                                onChange={(e) => handleCriterionChange(index, 'description', e.target.value)}
                                style={{ width: '30%', marginLeft: '10px' }}
                            />
                            <button onClick={() => deleteCriterion(index)} style={{ marginLeft: '10px' }}>
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Projeler</h3>
                <input
                    type="text"
                    placeholder="Proje Adı"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Proje Açıklaması"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />
                <button onClick={addProject} style={{ marginTop: '10px' }}>
                    Proje Ekle
                </button>
                <ul style={{ marginTop: '15px' }}>
                    {projects.map((project, index) => (
                        <li key={project.id}>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                style={{ width: '40%' }}
                            />
                            <input
                                type="text"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                style={{ width: '40%', marginLeft: '10px' }}
                            />
                            <button onClick={() => deleteProject(index)} style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default CompetitionForm;
