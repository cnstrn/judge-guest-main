
import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './styles.css';

function NicknameEntryPage() {
    const [nickname, setNickname] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { competitionId } = useParams();

    const handleNicknameSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            setUser({ name: nickname, role: 'user' });
            navigate(`/competition/${competitionId}`);  // redirecting kısmı
        }
    };
    

    return (
        <div className="container">
            <h2>Kullanıcı Adınızı Girin</h2>
            <form onSubmit={handleNicknameSubmit}>
                <label>Kullanıcı Adı:</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <button type="submit">Katıl</button>
            </form>
        </div>
    );
}

export default NicknameEntryPage;
