import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import config from '../config';
import CompetitionForm from './CompetitionForm'; // CompetitionForm componenti
import './styles.css';

const socket = io(`${config.backendURL}`);

function CreateCompetitionPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [competitionName, setCompetitionName] = useState('');
    const [competitionDate, setCompetitionDate] = useState('');
    const [criteria, setCriteria] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editingCriterionIndex, setEditingCriterionIndex] = useState(null);
    const [editingProjectIndex, setEditingProjectIndex] = useState(null);
    const [juryVoteCoefficient, setJuryVoteCoefficient] = useState(2); // Varsayılan jüri katsayısı

    // Yarışmayı oluşturma fonksiyonu
    const handleCreateCompetition = () => {
        if (competitionName && competitionDate && criteria.length && projects.length) {
            socket.emit('createCompetition', {
                name: competitionName,
                date: competitionDate,
                criteria,
                projects,
                createdBy: user.name,
                juryVoteCoefficient: juryVoteCoefficient, // Jüri katsayısı gönderildi (Yeni eklendi)
            });

            socket.on('competitionCreated', (competitionId) => {
                navigate(`/competition/${competitionId}`);
            });
        } else {
            alert('Lütfen tüm alanları doldurun.');
        }
    };

    return (
        <div className="competition-container">
            <h1>Yarışma Oluştur</h1>
            <div className="competition-form">
                <CompetitionForm
                    competitionName={competitionName}
                    setCompetitionName={setCompetitionName}
                    competitionDate={competitionDate}
                    setCompetitionDate={setCompetitionDate}
                    criteria={criteria}
                    setCriteria={setCriteria}
                    projects={projects}
                    setProjects={setProjects}
                    juryVoteCoefficient={juryVoteCoefficient}
                    setJuryVoteCoefficient={setJuryVoteCoefficient}
                />
                <button
                    onClick={handleCreateCompetition}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '15px',
                    }}
                >
                    Yarışma Oluştur
                </button>
            </div>

            {/* Kriter ve Proje alanlarını ekle */}
            <div className="added-section">
                {/* Eklenen Kriterler */}
                <h3>Eklenen Kriterler</h3>
                <ul>
                    {criteria.map((criterion, index) => (
                        <li key={index}>
                            {editingCriterionIndex === index ? (
                                <>
                                    <input
                                        type="text"
                                        value={criterion.name}
                                        onChange={(e) => {
                                            const updatedCriteria = [...criteria];
                                            updatedCriteria[index].name = e.target.value;
                                            setCriteria(updatedCriteria);
                                        }}
                                    />
                                    <textarea
                                        value={criterion.description}
                                        onChange={(e) => {
                                            const updatedCriteria = [...criteria];
                                            updatedCriteria[index].description = e.target.value;
                                            setCriteria(updatedCriteria);
                                        }}
                                    />
                                    <button onClick={() => setEditingCriterionIndex(null)}>Kaydet</button>
                                </>
                            ) : (
                                <>
                                    {criterion.name} - Katsayı: {criterion.coefficient}
                                    <br />
                                    Açıklama: {criterion.description}
                                    <button className="small-button" onClick={() => setEditingCriterionIndex(index)}>
                                        Düzenle
                                    </button>
                                    <button
                                        className="small-button"
                                        onClick={() => setCriteria(criteria.filter((_, i) => i !== index))}
                                    >
                                        Sil
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Eklenen Projeler */}
                <h3>Eklenen Projeler</h3>
                <ul>
                    {projects.map((project, index) => (
                        <li key={index}>
                            {editingProjectIndex === index ? (
                                <>
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => {
                                            const updatedProjects = [...projects];
                                            updatedProjects[index].name = e.target.value;
                                            setProjects(updatedProjects);
                                        }}
                                    />
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => {
                                            const updatedProjects = [...projects];
                                            updatedProjects[index].description = e.target.value;
                                            setProjects(updatedProjects);
                                        }}
                                    />
                                    <button onClick={() => setEditingProjectIndex(null)}>Kaydet</button>
                                </>
                            ) : (
                                <>
                                    {project.name} - {project.description}
                                    <button className="small-button" onClick={() => setEditingProjectIndex(index)}>
                                        Düzenle
                                    </button>
                                    <button
                                        className="small-button"
                                        onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                                    >
                                        Sil
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CreateCompetitionPage;
