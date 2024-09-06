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
        <div className="container">
            <h1>Yarışma Oluştur</h1>
            <CompetitionForm
                competitionName={competitionName}
                setCompetitionName={setCompetitionName}
                competitionDate={competitionDate}
                setCompetitionDate={setCompetitionDate}
                criteria={criteria}
                setCriteria={setCriteria}
                projects={projects}
                setProjects={setProjects}
                juryVoteCoefficient={juryVoteCoefficient} // Jüri katsayısı iletildi (Yeni eklendi)
                setJuryVoteCoefficient={setJuryVoteCoefficient}
            />
            <button onClick={handleCreateCompetition} style={{ width: '90%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}>
                Yarışma Oluştur
            </button>
        </div>
    );
}

export default CreateCompetitionPage;
