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

    // Yeni kriter ekleme fonksiyonu (200 karakter sınırı)
    const addCriterion = () => {
        if (newCriterion.trim() && newCriterionDescription.length <= 200) {
            setCriteria([...criteria, {
                name: newCriterion.trim(),
                coefficient: Number(newCriterionCoefficient),
                description: newCriterionDescription.trim(),
            }]);
            setNewCriterion('');
            setNewCriterionCoefficient(1);
            setNewCriterionDescription('');
        } else {
            alert('Kriter açıklaması 200 karakteri geçemez.');
        }
    };

    // Mevcut kriterleri değiştirme fonksiyonu
    const handleCriterionChange = (index, field, value) => {
        const updatedCriteria = [...criteria];
        if (field === 'description' && value.length > 200) {
            alert('Kriter açıklaması 200 karakteri geçemez.');
        } else {
            updatedCriteria[index][field] = field === 'coefficient' ? Number(value) : value;
            setCriteria(updatedCriteria);
        }
    };

    // Kriter silme fonksiyonu
    const deleteCriterion = (index) => {
        setCriteria(criteria.filter((_, i) => i !== index));
    };

    // Yeni proje ekleme fonksiyonu (100 karakter sınırı ve açıklama 200 karakter sınırı)
    const addProject = () => {
        if (newProjectName.trim() && newProjectName.length <= 100 && newProjectDescription.trim() && newProjectDescription.length <= 200) {
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
        } else if (newProjectName.length > 100) {
            alert('Proje adı 100 karakteri geçemez.');
        } else if (newProjectDescription.length > 200) {
            alert('Proje açıklaması 200 karakteri geçemez.');
        } else {
            alert('Lütfen tüm alanları doldurun.');
        }
    };

    // Mevcut projeleri değiştirme fonksiyonu
    const handleProjectChange = (index, key, value) => {
        const updatedProjects = [...projects];
        if (key === 'name' && value.length > 100) {
            alert('Proje adı 100 karakteri geçemez.');
        } else if (key === 'description' && value.length > 200) {
            alert('Proje açıklaması 200 karakteri geçemez.');
        } else {
            updatedProjects[index] = {
                ...updatedProjects[index],
                [key]: value,
            };
            setProjects(updatedProjects);
        }
    };

    // Proje silme fonksiyonu
    const deleteProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Adı:</label>
                <input
                    type="text"
                    value={competitionName}
                    onChange={(e) => setCompetitionName(e.target.value)}
                    style={{ width: '75%', padding: '8px', marginTop: '5px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Tarihi:</label>
                <input
                    type="date"
                    value={competitionDate}
                    onChange={(e) => setCompetitionDate(e.target.value)}
                    style={{ width: '50%', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Jüri Oy Katsayısı:</label>
                <input
                    type="number"
                    value={juryVoteCoefficient}
                    onChange={(e) => setJuryVoteCoefficient(Number(e.target.value))}
                    min="1"
                    style={{ width: '10%', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Kriterler</h3>
                <label>Kriter Adı:</label>
                <input
                    type="text"
                    placeholder="Kriter Adı"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    style={{ width: '80%', padding: '8px', marginTop: '5px' }}
                />
                <label style={{ marginTop: '10px', display: 'block' }}>Katsayı:</label>
                <input
                    type="number"
                    placeholder="Katsayı"
                    value={newCriterionCoefficient}
                    onChange={(e) => setNewCriterionCoefficient(e.target.value)}
                    min="1"
                    style={{ width: '10%', padding: '8px', marginTop: '5px' }}
                />
                <label style={{ marginTop: '10px', display: 'block' }}>Kriter Açıklaması:</label>
                <input
                    type="text"
                    placeholder="Kriter Açıklaması (Max 200 karakter)"
                    value={newCriterionDescription}
                    onChange={(e) => setNewCriterionDescription(e.target.value)}
                    style={{ width: '90%', padding: '8px', marginTop: '5px' }}
                />
                <p>{newCriterionDescription.length}/200 karakter</p>
                <button onClick={addCriterion} style={{ marginTop: '10px', padding: '10px', width: '30%' }}>
                    Kriter Ekle
                </button>
                <ul style={{ marginTop: '15px' }}>
                    {criteria.map((criterion, index) => (
                        <li key={index} style={{ marginBottom: '15px' }}>
                            <label>Kriter Adı:</label>
                            <input
                                type="text"
                                value={criterion.name}
                                onChange={(e) => handleCriterionChange(index, 'name', e.target.value)}
                                style={{ width: '80%', padding: '8px', marginTop: '5px' }}
                            />
                            <label style={{ marginTop: '10px', display: 'block' }}>Katsayı:</label>
                            <input
                                type="number"
                                value={criterion.coefficient}
                                onChange={(e) => handleCriterionChange(index, 'coefficient', e.target.value)}
                                style={{ width: '10%', padding: '8px', marginTop: '5px' }}
                                min="1"
                            />
                            <label style={{ marginTop: '10px', display: 'block' }}>Kriter Açıklaması:</label>
                            <input
                                type="text"
                                value={criterion.description}
                                onChange={(e) => handleCriterionChange(index, 'description', e.target.value)}
                                style={{ width: '90%', padding: '8px', marginTop: '5px' }}
                            />
                            <button onClick={() => deleteCriterion(index)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '10%' }}>
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Projeler</h3>
                <label>Proje Adı:</label>
                <input
                    type="text"
                    placeholder="Proje Adı (Max 100 karakter)"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{ width: '90%', padding: '8px', marginTop: '5px' }}
                />
                <p>{newProjectName.length}/100 karakter</p>
                <label>Proje Açıklaması:</label>
                <input
                    type="text"
                    placeholder="Proje Açıklaması (Max 200 karakter)"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    style={{ width: '80%', padding: '8px', marginTop: '5px' }}
                />
                <p>{newProjectDescription.length}/200 karakter</p>
                <button onClick={addProject} style={{ marginTop: '10px', padding: '10px', width: '30%' }}>
                    Proje Ekle
                </button>
                <ul style={{ marginTop: '15px' }}>
                    {projects.map((project, index) => (
                        <li key={project.id} style={{ marginBottom: '15px' }}>
                            <label>Proje Adı:</label>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                style={{ width: '90%', padding: '8px', marginTop: '5px' }}
                            />
                            <label style={{ marginTop: '10px', display: 'block' }}>Proje Açıklaması:</label>
                            <input
                                type="text"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                style={{ width: '90%', padding: '8px', marginTop: '5px' }}
                            />
                            <button onClick={() => deleteProject(index)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '10%' }}>
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CompetitionForm;
