import React, { useState } from 'react';
import CompetitionList from './CompetitionList';

function CompetitionForm({
    competitionName, setCompetitionName,
    competitionDate, setCompetitionDate,
    criteria, setCriteria,
    projects, setProjects,
    juryVoteCoefficient, setJuryVoteCoefficient // Add jury vote coefficient state
}) {
    const [newCriterion, setNewCriterion] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const addCriterion = () => {
        if (newCriterion.trim()) {
            setCriteria([...criteria, newCriterion.trim()]);
            setNewCriterion('');
        }
    };

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

    return (
        <div>
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

            {/* Jury Vote Coefficient Section */}
            <div style={{ marginBottom: '15px' }}>
                <label>Jüri Oy Katsayısı:</label>
                <input
                    type="number"
                    value={juryVoteCoefficient}
                    onChange={(e) => setJuryVoteCoefficient(e.target.value)}
                    min="1"
                />
            </div>

            <CompetitionList
                criteria={criteria}
                setCriteria={setCriteria}
                newCriterion={newCriterion}
                setNewCriterion={setNewCriterion}
                addCriterion={addCriterion}
                projects={projects}
                setProjects={setProjects}
                newProjectName={newProjectName}
                setNewProjectName={setNewProjectName}
                newProjectDescription={newProjectDescription}
                setNewProjectDescription={setNewProjectDescription}
                addProject={addProject}
            />
        </div>
    );
}

export default CompetitionForm;
