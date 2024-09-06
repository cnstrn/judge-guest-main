import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import { QRCodeCanvas } from 'qrcode.react';
import ConnectedUsersList from './ConnectedUsersList';
import ProjectList from './ProjectList';
import config from '../config';
import './styles.css';

const socket = io(`${config.backendURL}`);

function CompetitionPage() {
    const { competitionId } = useParams(); // URL'den yarışma ID'si alınıyor
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [competition, setCompetition] = useState(null); // Yarışma bilgilerini tutan state
    const [username, setUsername] = useState(user.name || ''); // Kullanıcı adını tutan state
    const [votingStarted, setVotingStarted] = useState(false); // Oylamanın başlayıp başlamadığını tutan state
    const [votingFinished, setVotingFinished] = useState(false); // Oylamanın bitip bitmediğini tutan state
    const [resultsVisible, setResultsVisible] = useState(false); // Sonuçların görünürlüğünü tutan state
    const [winningProject, setWinningProject] = useState(null); // Kazanan projeyi tutan state
    const [juryMembers, setJuryMembers] = useState([]); // Jüri üyelerini tutan state
    const [juryVoteCoefficient, setJuryVoteCoefficient] = useState(2); // Jüri oy katsayısı

    useEffect(() => {
        if (!user.name) {
            return;
        }

        // Yarışmaya katılım isteği gönderiliyor
        socket.emit('joinCompetition', { competitionId, name: user.name });
        // Yarışma verileri alındığında. (Eklemeler yapıldı)
        socket.on('competitionData', (data) => {
            const uniqueUsers = Array.from(new Set(data.connectedUsers.map(u => u.name)))
                .map(name => data.connectedUsers.find(u => u.name === name));

            // Yarışma verileri güncelleniyor
            setCompetition({
                ...data,
                connectedUsers: uniqueUsers,
                criteria: data.criteria.map(criterion => ({
                    ...criterion,
                    coefficient: criterion.coefficient || 1, // Kriter katsayıları (yeni)
                    description: criterion.description || '',
                })),
            });
            setJuryMembers(data.juryMembers || []);
            setVotingStarted(data.votingStarted || false);
            setVotingFinished(data.votingFinished || false);
            setResultsVisible(data.resultsVisible || false);
            setJuryVoteCoefficient(data.juryVoteCoefficient || 2);

            // Kazanan proje belirleniyor. Yarışma durumu için
            if (data.resultsVisible) {
                const winning = data.projects.reduce((max, project) => 
                    project.averageScore > (max?.averageScore || 0) ? project : max, null);
                setWinningProject(winning);
            }
        });

        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user]);

    const startVoting = () => {
        setVotingStarted(true);
        socket.emit('startVoting', { competitionId });
    };

    const finishVoting = () => {
        setVotingStarted(false);
        setVotingFinished(true);
        socket.emit('finishVoting', { competitionId });
    };

    const handleShowResults = () => {
        socket.emit('showResults', { competitionId });
        setResultsVisible(true);
    };

    const toggleJuryMember = (userName) => {
        if (votingStarted) return; // Oylama başladıysa jüri değiştirme engelleniyor

        const updatedJury = juryMembers.includes(userName)
            ? juryMembers.filter(jury => jury !== userName)
            : [...juryMembers, userName];

        setJuryMembers(updatedJury);
        socket.emit('updateJuryMembers', { competitionId, juryMembers: updatedJury });
    };

    const returnToLobby = () => {
        navigate('/lobby');
    };

    // Yarışma durumunu gösteren mesajlar
    const renderStatusMessage = () => {
        if (resultsVisible) {
            return `Sonuçlar açıklandı. Kazanan proje: ${winningProject?.name || 'Henüz kazanan yok'}`;
        }
        if (votingFinished) {
            return 'Oylama sona erdi.';
        }
        if (votingStarted) {
            return 'Oylama başladı.';
        }
        return 'Oylamanın başlatılması bekleniyor.';
    };

    // Kullanıcı adı alınmadıysa (qr veya link ile bağlananlar)
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

    if (!competition) {
        return <div>Yarışma bulunamadı...</div>;
    }

    return (
        <div className="container">
            <h1>{competition.name}</h1>
            <h3>Tarih: {competition.date || 'Tarih belirtilmedi'}</h3>

            {(user.role === 'admin' || user.role === 'member') && (
                <div className="qr-section">
                    <div className="competition-code">
                        <span>Yarışma Kodu:</span>
                        <strong>{competitionId}</strong>
                    </div>
                    <QRCodeCanvas
                        value={`${config.frontendURL}/competition/${competitionId}`}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={true}
                    />
                    <p>Yarışmaya katılmak için bu QR kodu tarayın.</p>
                </div>
            )}

            {/* Yarışma Durumu. Yeni eklendi */}
            <div className="competition-status">
                <h3>Durum: {renderStatusMessage()}</h3>
            </div>

            <h3>Kriterler</h3>
            <ul>
                {competition.criteria.map((criterion, index) => (
                    <li key={index}>
                        <strong>{criterion.name}</strong>: {criterion.description} (Katsayı: {criterion.coefficient})
                    </li>
                ))}
            </ul>

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

            <ConnectedUsersList
                connectedUsers={competition.connectedUsers}
                user={user}
                juryMembers={juryMembers}
                toggleJuryMember={toggleJuryMember}
            />

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

            {resultsVisible && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={returnToLobby}>Lobiye Dön</button>
                </div>
            )}
        </div>
    );
}

export default CompetitionPage;
