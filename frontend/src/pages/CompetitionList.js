// kriter ve projelerin listelenmesi
import React from 'react';

function CompetitionList({
    criteria, setCriteria,
    newCriterion, setNewCriterion,
    addCriterion,
    projects, setProjects,
    newProjectName, setNewProjectName,
    newProjectDescription, setNewProjectDescription,
    addProject
}) {

    const handleCriterionChange = (index, value) => {
        const updatedCriteria = [...criteria];
        updatedCriteria[index] = value;
        setCriteria(updatedCriteria);
    };

    const deleteCriterion = (index) => {
        setCriteria(criteria.filter((_, i) => i !== index));
    };

    const handleProjectChange = (index, key, value) => {
        const updatedProjects = [...projects];
        updatedProjects[index] = {
            ...updatedProjects[index],
            [key]: value,
        };
        setProjects(updatedProjects);
    };

    const deleteProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    return (
        <>
            <div style={{ marginBottom: '15px' }}>
                <h3>Kriterler</h3>
                <input
                    type="text"
                    placeholder="Kriter Ekle"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                />
                <button onClick={addCriterion} style={{ marginTop: '10px' }}>
                    Kriter Ekle
                </button>
                <ul style={{ marginTop: '15px' }}>
                    {criteria.map((criterion, index) => (
                        <li key={index}>
                            <input
                                type="text"
                                value={criterion}
                                onChange={(e) => handleCriterionChange(index, e.target.value)}
                                style={{ width: '80%' }}
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
                                style={{ width: '40%' }}
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

export default CompetitionList;
