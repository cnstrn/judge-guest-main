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

    return (
        <div>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Adı:</label>
                <br />
                <input
                    type="text"
                    value={competitionName}
                    onChange={(e) => setCompetitionName(e.target.value)}
                    style={{ padding: '8px', marginTop: '5px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>Yarışma Tarihi:</label>
                <br />
                <input
                    type="date"
                    value={competitionDate}
                    onChange={(e) => setCompetitionDate(e.target.value)}
                    style={{ width: '30%', padding: '8px', marginTop: '5px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label>Jüri Oy Katsayısı:</label>
                <br />
                <input
                    type="number"
                    value={juryVoteCoefficient}
                    onChange={(e) => setJuryVoteCoefficient(Number(e.target.value))}
                    min="1"
                    style={{ width: '25%', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Kriter Ekle</h3>
                <label>Kriter Adı:</label>
                <br />
                <input
                    type="text"
                    placeholder="Kriter Adı"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    style={{ padding: '8px', marginTop: '5px' }}
                />
                <br />
                <label>Kriter Katsayısı:</label>
                <br />
                <input
                    type="number"
                    placeholder="Katsayı"
                    value={newCriterionCoefficient}
                    onChange={(e) => setNewCriterionCoefficient(e.target.value)}
                    min="1"
                    style={{ width: '20%', padding: '8px', marginTop: '5px' }}
                />
                <br />
                <label>Kriter Açıklaması:</label>
                <br />
                <input
                    type="text"
                    placeholder="Kriter Açıklaması (Max 200 karakter)"
                    value={newCriterionDescription}
                    onChange={(e) => setNewCriterionDescription(e.target.value)}
                    style={{ padding: '8px', marginTop: '5px' }}
                />
                <br />
                <button onClick={addCriterion} style={{ marginTop: '10px', padding: '10px', width: '30%' }}>
                    Kriter Ekle
                </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h3>Proje Ekle</h3>
                <label>Proje Adı:</label>
                <br />
                <input
                    type="text"
                    placeholder="Proje Adı (Max 100 karakter)"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{ padding: '8px', marginTop: '5px' }}
                />
                <br />
                <label>Proje Açıklaması:</label>
                <br />
                <input
                    type="text"
                    placeholder="Proje Açıklaması (Max 200 karakter)"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    style={{ padding: '8px', marginTop: '5px' }}
                />
                <br />
                <button onClick={addProject} style={{ marginTop: '10px', padding: '10px', width: '30%' }}>
                    Proje Ekle
                </button>
            </div>
        </div>
    );
}

export default CompetitionForm;
