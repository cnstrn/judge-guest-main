import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import { QRCodeCanvas } from 'qrcode.react';
import ConnectedUsersList from './ConnectedUsersList';
import ProjectList from './ProjectList';
import './styles.css';

// Socket.IO ile backend sunucusuna bağlan
const socket = io('http://localhost:5000');

function CompetitionPage() {
    const { competitionId } = useParams(); 
    const navigate = useNavigate(); 
    const { user, setUser } = useContext(UserContext); 

    const [competition, setCompetition] = useState(null); // Yarışma verilerini tutacak state
    const [username, setUsername] = useState(user.name || ''); // Kullanıcı adını tutacak state
    const [votingStarted, setVotingStarted] = useState(false); // Oylama başladı mı kontrol eden state
    const [votingFinished, setVotingFinished] = useState(false); // Oylama bitmiş mi kontrol eden state
    const [resultsVisible, setResultsVisible] = useState(false); // Sonuçların görüntülenmesini kontrol eden state
    const [juryMembers, setJuryMembers] = useState([]); // Jüri üyelerini tutacak state
    const [juryVoteCoefficient, setJuryVoteCoefficient] = useState(2); // Varsayılan jüri oy katsayısı

    useEffect(() => {
        // Kullanıcı adı varsa yarışmaya katıl
        if (!user.name) {
            return;
        }

        // Yarışmaya katılma isteği
        socket.emit('joinCompetition', { competitionId, name: user.name });

        // Yarışma verilerini alma ve state güncellemeleri
        socket.on('competitionData', (data) => {
            const uniqueUsers = Array.from(new Set(data.connectedUsers.map(u => u.name)))
                .map(name => data.connectedUsers.find(u => u.name === name));

            setCompetition({
                ...data,
                connectedUsers: uniqueUsers,
            });
            setJuryMembers(data.juryMembers || []);
            setVotingStarted(data.votingStarted || false);
            setVotingFinished(data.votingFinished || false);
            setResultsVisible(data.resultsVisible || false);
            setJuryVoteCoefficient(data.juryVoteCoefficient || 2);
        });

        // Component unmount olduğunda socket dinleyiciyi temizliyoruz
        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user]);

    // Oylamayı başlatma fonksiyonu
    const startVoting = () => {
        setVotingStarted(true);
        socket.emit('startVoting', { competitionId });
    };

    // Oylamayı bitirme fonksiyonu
    const finishVoting = () => {
        setVotingStarted(false);
        setVotingFinished(true);
        socket.emit('finishVoting', { competitionId });
    };

    // Sonuçları gösterme fonksiyonu
    const handleShowResults = () => {
        socket.emit('showResults', { competitionId });
        setResultsVisible(true);
    };

    // Jüri üyelerini ekleme veya çıkarma fonksiyonu
    const toggleJuryMember = (userName) => {
        const updatedJury = juryMembers.includes(userName)
            ? juryMembers.filter(jury => jury !== userName)
            : [...juryMembers, userName];

        setJuryMembers(updatedJury);
        socket.emit('updateJuryMembers', { competitionId, juryMembers: updatedJury });
    };

    // Lobiye dönme fonksiyonu
    const returnToLobby = () => {
        navigate('/lobby');
    };

    // Kullanıcı adı yoksa kullanıcıyı yarışmaya katılması için kullanıcı adı gireceği form
    if (!user.name) {
        return (
            <div className="container">
                <h2>Yarışmaya Katıl</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setUser({ name: username, role: 'user' });
                    socket.emit('joinCompetition', { competitionId, name: username });
                }}>
                    <label>Kullanıcı Adınızı Girin:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit">Katıl</button>
                </form>
            </div>
        );
    }

    // Yarışma bulunamadı mesajı
    if (!competition) {
        return <div>Yarışma bulunamadı...</div>;
    }

    return (
        <div className="container">
            <h1>{competition.name}</h1>
            <h3>Tarih: {competition.date || 'Tarih belirtilmedi'}</h3>

            {/* Admin veya üye rolündeki kullanıcılar için QR kod ve yarışma kodu */}
            {(user.role === 'admin' || user.role === 'member') && (
                <div className="qr-section">
                    <div className="competition-code">
                        <span>Yarışma Kodu:</span>
                        <strong>{competitionId}</strong>
                    </div>
                    <QRCodeCanvas
                        value={`http://localhost:3000/competition/${competitionId}`}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={true}
                    />
                    <p>Yarışmaya katılmak için bu QR kodu tarayın.</p>
                </div>
            )}

            <h3>Jüri Oy Katsayısı: {juryVoteCoefficient}</h3>

            {/* Proje listesi */}
            <ProjectList
                projects={competition.projects}
                resultsVisible={resultsVisible}
                user={user}
                competitionId={competitionId}
                votingStarted={votingStarted}
                juryMembers={juryMembers}
                juryVoteCoefficient={juryVoteCoefficient}
                navigate={navigate}
            />

            {/* Katılımcı listesi */}
            <ConnectedUsersList
                connectedUsers={competition.connectedUsers}
                user={user}
                juryMembers={juryMembers}
                toggleJuryMember={toggleJuryMember}
            />

            {/* Admin veya üye rolündeki kullanıcılar için voting işlemleri */}
            {(user.role === 'admin' || user.role === 'member') && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={startVoting} disabled={votingStarted || votingFinished}>
                        Oylamayı Başlat
                    </button>
                    <button onClick={finishVoting} disabled={!votingStarted} style={{ marginLeft: '10px' }}>
                        Oylamayı Bitir
                    </button>
                    {!resultsVisible && votingFinished && (
                        <button onClick={handleShowResults} style={{ marginLeft: '10px' }}>
                            Sonuçları Gör
                        </button>
                    )}
                </div>
            )}

            {/* Sonuçlar görünüyorsa lobiye dönme butonu */}
            {resultsVisible && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={returnToLobby}>Lobiye Dön</button>
                </div>
            )}
        </div>
    );
}

export default CompetitionPage;