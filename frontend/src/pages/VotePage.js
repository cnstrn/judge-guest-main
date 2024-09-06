import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import './styles.css';

// Backend sunucusuyla bağlantıyı başlatma
const socket = io('http://localhost:5000');

function VotePage() {
    const { competitionId, projectId } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const { user } = useContext(UserContext); 

    const [competition, setCompetition] = useState(null); // Yarışma verileri
    const [votes, setVotes] = useState({}); // Her kriter için oy verileri
    const [isJury, setIsJury] = useState(false); // Kullanıcının jüri üyesi olup olmadığını kontrol et
    const [comment, setComment] = useState(''); // Kullanıcının proje için yorumu
    const juryVoteCoefficient = location.state.juryVoteCoefficient || 2; // Jüri katsayısını al ya da varsayılan olarak 2 kullan

    // Yarışma verilerini al ve kullanıcının jüri üyesi olup olmadığını kontrol et
    useEffect(() => {
        if (!user.name) {
            navigate('/'); // Kullanıcı adı yoksa ana sayfaya yönlendirme
            return;
        }

        // Sunucudan yarışma verilerini talep etme
        socket.emit('requestCompetitionData', { competitionId });

        socket.on('competitionData', (data) => {
            setCompetition(data);
            setIsJury(location.state.juryMembers.includes(user.name)); // Kullanıcının jüri üyesi olup olmadığını kontrol etme
        });

        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user.name, location.state.juryMembers, navigate]);

    // Her kriter için verilen oyu işle.
    const handleVoteChange = (criterion, score) => {
        setVotes((prevVotes) => ({
            ...prevVotes,
            [criterion]: score,
        }));
    };

    // Oyları sunucuya gönderme
    const submitVotes = () => {
        const totalScore = Object.values(votes).reduce((sum, score) => sum + score, 0); // Toplam puanı hesapla
        const averageScore = totalScore / Object.keys(votes).length; // Ortalama puanı hesapla

        // Kullanıcı jüri üyesiyse jüri katsayısını uygulama
        const finalScore = isJury ? averageScore * juryVoteCoefficient : averageScore;

        // Oyları sunucuya gönderme
        socket.emit('submitVotes', {
            competitionId,
            projectId,
            finalScore,
            userName: user.name,
            comment: comment.trim(),
        });

        // Yarışma sayfasına geri yönlendirme
        navigate(`/competition/${competitionId}`);
    };

    if (!competition) {
        return <div>Yükleniyor...</div>;
    }

    const project = competition.projects.find(p => p.id === projectId);
    if (!project) {
        return <div>Proje bulunamadı.</div>;
    }

    return (
        <div className="container">
            <h2>{project.name} için Oy Verin</h2>

            {/* Kullanıcı jüri üyesiyse bir uyarı mesajı gösterme */}
            {isJury && <p className="jury-info">Jüri üyesi olarak atandınız. Oylarınız {juryVoteCoefficient} katı değerindedir.</p>}

            {/* Oy verme seçeneklerini göster */}
            <div className="likert-container">
                {competition.criteria.map((criterion, index) => (
                    <div key={index} className="likert-item" style={{ marginBottom: '15px' }}>
                        <label>{criterion}: </label>
                        <div className="likert-buttons">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    onClick={() => handleVoteChange(criterion, score)}
                                    className={votes[criterion] === score ? 'selected' : ''}>
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Yorumlar için textarea */}
            <div style={{ marginTop: '15px' }}>
                <label>Yorum Bırakın:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Yorumunuzu buraya yazın..."
                />
            </div>

            {/* Oyları gönderme butonu */}
            <button onClick={submitVotes} style={{ width: '100%', marginTop: '20px' }}>
                Oyları Gönder
            </button>
        </div>
    );
}

export default VotePage;