import React from 'react';

function ProjectList({
    projects,
    resultsVisible,
    user,
    competitionId,
    votingStarted,
    juryMembers,
    juryVoteCoefficient,
    navigate
}) {
    // Projeleri ortalama puana göre sıralanması
    const sortedProjects = resultsVisible
        ? [...projects].sort((a, b) => b.averageScore - a.averageScore)
        : projects;

    return (
        <div>
            <h3>Projeler</h3>
            <div className="card-container">
                {sortedProjects.map((project, index) => (
                    <div key={project.id} className={`card ${index === 0 && resultsVisible ? 'highlight' : ''}`}>
                        <div className="card-content">
                            <h4>{project.name}</h4>
                            <p>{project.description}</p>

                            {resultsVisible ? (
                                <>
                                    {/* Sonuçlar görünüyorsa projelerin ortalama puanını ve kullanıcının kendi puanını gösterme */}
                                    <p>Ortalama Puan: {project.averageScore.toFixed(2)}</p>
                                    <p>Kendi Puanınız: {project.votes[user.name] || 'Puan verilmedi'}</p>
                                    {(user.role === 'admin' || user.role === 'member') && (
                                        <div>
                                            <h4>Kullanıcı Yorumları:</h4>
                                            {project.comments.length > 0 ? (
                                                <ul>
                                                    {/* Yorumları gösterme */}
                                                    {project.comments.map((comment, idx) => (
                                                        <li key={idx}>
                                                            <strong>{comment.userName}:</strong> {comment.comment}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Yorum bulunamadı.</p>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Sonuçlar görünmüyorsa sadece kullanıcının puanını göster
                                <p>Verdiğiniz Puan: {project.votes[user.name] || 'Puan verilmedi'}</p>
                            )}
                        </div>
                        <div className="card-actions" style={{ marginTop: '15px' }}>
                            <button
                                // VotePage'e yönlendirme
                                onClick={() => navigate(`/competition/${competitionId}/vote/${project.id}`, { state: { juryMembers, juryVoteCoefficient } })}
                                disabled={!votingStarted || project.votes[user.name]}
                            >
                                {project.votes[user.name] ? 'Oy Kullanıldı' : 'Oy Ver'}
                            </button>
                            {/* Kullanıcı oy verdiyse bilgilendirme */}
                            {project.votes[user.name] && <p style={{ marginTop: '10px' }}>Bu projeye zaten oy verdiniz.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;