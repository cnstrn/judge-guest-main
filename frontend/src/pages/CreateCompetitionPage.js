import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import CompetitionForm from './CompetitionForm';
import './styles.css';

// Socket.io bağlantısını başlat. (backend ip)
const socket = io('http://localhost:5000');

function CreateCompetitionPage() {
    const navigate = useNavigate(); 
    const { user } = useContext(UserContext); 

    // Yarışma bilgilerini saklamak için durum değişkenleri
    const [competitionName, setCompetitionName] = useState(''); // Yarışma adı
    const [competitionDate, setCompetitionDate] = useState(''); // Yarışma tarihi
    const [criteria, setCriteria] = useState([]); // Yarışma kriterleri
    const [projects, setProjects] = useState([]); // Yarışma projeleri
    const [juryVoteCoefficient, setJuryVoteCoefficient] = useState(2); // Varsayılan jüri oy katsayısı

    // Yarışmayı oluşturma işlemini gerçekleştiren fonksiyon
    const handleCreateCompetition = () => {
        if (competitionName && competitionDate && criteria.length && projects.length) {
            // Yarışma bilgilerini sunucuya gönderme
            socket.emit('createCompetition', {
                name: competitionName,
                date: competitionDate,
                criteria,
                projects,
                createdBy: user.name, // Yarışmayı oluşturan kullanıcı
                juryVoteCoefficient: juryVoteCoefficient, 
            });

            // Yarışma başarıyla oluşturulduğunda yarışma sayfasına geçilir
            socket.on('competitionCreated', (competitionId) => {
                navigate(`/competition/${competitionId}`);
            });
        } else {
            alert('Lütfen tüm alanları, yarışma tarihi de dahil olmak üzere doldurun.');
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
                juryVoteCoefficient={juryVoteCoefficient} // Katsayıyı aktarma
                setJuryVoteCoefficient={setJuryVoteCoefficient} // Katsayıyı güncelleme
            />
            {/* Yarışma oluşturma butonu */}
            <button onClick={handleCreateCompetition} style={{ width: '90%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}>
                Yarışma Oluştur
            </button>
        </div>
    );
}

export default CreateCompetitionPage;