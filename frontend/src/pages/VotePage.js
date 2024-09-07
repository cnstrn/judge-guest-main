import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import config from '../config';
import './styles.css';

// Sunucuya soket bağlantısı başlatılıyor
const socket = io(`${config.backendURL}`);

function VotePage() {
    const { competitionId, projectId } = useParams(); // ProjectId'yi URL'den alır
    const location = useLocation(); 
    const navigate = useNavigate(); // Sayfalar arası yönlendirme için kullanılır
    const { user } = useContext(UserContext); // Kullanıcı bilgilerini context'ten alır

    const [competition, setCompetition] = useState(null); // Yarışma verilerini tutan state
    const [votes, setVotes] = useState({}); // Her kriter için oy verilerini tutan state
    const [isJury, setIsJury] = useState(false); // Kullanıcının jüri üyesi olup olmadığını belirler
    const [comment, setComment] = useState(''); // Proje için kullanıcının yorumunu tutar
    const [errorMessage, setErrorMessage] = useState(''); // Eksik oylar için hata mesajını tutar
    const juryVoteCoefficient = location.state.juryVoteCoefficient || 2;  // Jüri katsayısı, varsayılan olarak 2

    // Yarışma verilerini sunucudan al ve kullanıcının jüri üyesi olup olmadığını kontrol et
    useEffect(() => {
        if (!user.name) {
            navigate('/'); // Eğer kullanıcı adı yoksa, ana sayfaya yönlendir
            return;
        }

        // Sunucudan yarışma verilerini iste
        socket.emit('requestCompetitionData', { competitionId });

        // Sunucudan gelen yarışma verilerini dinle
        socket.on('competitionData', (data) => {
            setCompetition(data);
            setIsJury(location.state.juryMembers.includes(user.name)); // Kullanıcının jüri üyesi olup olmadığını kontrol et
        });

        // Bileşen kaldırıldığında event listener'ı temizle
        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user.name, location.state.juryMembers, navigate]);

    // Her kriter için oy değişikliklerini yönet
    const handleVoteChange = (criterion, score) => {
        setVotes((prevVotes) => ({
            ...prevVotes,
            [criterion]: score,
        }));
    };

    // Oyları sunucuya gönderme işlemi
    const submitVotes = () => {
        // Tüm kriterlere oy verilip verilmediğini kontrol et
        const missingVotes = competition.criteria.some(criterion => !votes[criterion.name]);

        if (missingVotes) {
            setErrorMessage('Lütfen tüm kriterler için oy verin.'); // Eğer bir kriter eksikse hata mesajı göster
            return;
        }

        // Oyları sunucuya gönder
        socket.emit('submitVotes', {
            competitionId,
            projectId,
            userName: user.name,
            comment: comment.trim(),
            votes: votes // Her kriter için oylar gönderilir
        });

        // Yarışma sayfasına geri yönlendir
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
        <div className="voting-container">
            <h2>{project.name} için Oy Verin</h2>

            {/* Tüm kriterlere oy verilmediyse hata mesajı göster */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Jüri üyesi uyarısı göster */}
            {isJury && (
                <p className="jury-info">
                    Jüri üyesi olarak atandınız. Oylarınız {juryVoteCoefficient} katı değerindedir.
                </p>
            )}

            {/* Oylama işlemi (1-5 ölçeği) */}
            <div className="likert-container">
                {competition.criteria.map((criterion, index) => (
                    <div key={index} className="likert-item" style={{ marginBottom: '15px' }}>
                        <div>
                            <label>{criterion.name} (Katsayı: {criterion.coefficient})</label>
                            {/* Kriter açıklaması */}
                            <p style={{ marginTop: '5px', marginBottom: '10px' }}>{criterion.description}</p>
                        </div>
                        <div className="likert-buttons">
                            {[1, 2, 3, 4, 5].map((score) => ( // 1'den 5'e kadar ölçek
                                <button
                                    key={score}
                                    onClick={() => handleVoteChange(criterion.name, score)}
                                    className={votes[criterion.name] === score ? 'selected' : ''}>
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Yorum bırakma alanı */}
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
