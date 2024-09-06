//yarismaya katilma veya yarisma olusturma eventi(sadece admin ve memberlar)
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './styles.css';

function LobbyPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [competitionCode, setCompetitionCode] = useState('');

    const handleJoinCompetition = () => {
        if (competitionCode) {
            navigate(`/competition/${competitionCode}`);
        }
    };

    const handleCreateCompetition = () => {
        navigate('/create-competition');
    };

    return (
        <div className="container">
            <h1>Lobi</h1>
            <p className="lobby-welcome">Hoş geldiniz, <strong>{user.name}</strong>! Rolünüz: <strong>{user.role}</strong>.</p>
            <input
                type="text"
                placeholder="Yarışma kodunu girin"
                value={competitionCode}
                onChange={(e) => setCompetitionCode(e.target.value)}
            />
            <div style={{ marginTop: '15px' }}> 
                <button onClick={handleJoinCompetition} disabled={!competitionCode}>
                    Yarışmaya Katıl
                </button>
                {(user.role === 'admin' || user.role === 'member') && (
                    <button onClick={handleCreateCompetition} style={{ marginLeft: '15px', backgroundColor: '#28a745' }}>
                        Yarışma Oluştur
                    </button>
                )}
            </div>
        </div>
    );
}

export default LobbyPage;
