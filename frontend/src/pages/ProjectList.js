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
        <p>Ortalama Puan: {project.averageScore.toFixed(2)}</p>

        {/* Kendi Puanlarınızı ve ortalama puanınızı hesaplayıp gösterme */}
        {project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
            <div>
                <h4>Kendi Puanlarınız:</h4>
                {Object.entries(project.votes[user.name]).map(([criterion, score]) => (
                    <p key={criterion}>{criterion}: {score}</p>
                ))}
                
                {/* Calculate and show the average score given by the user */}
                <p><strong>Verdiğiniz Ortalama Puan:</strong> {(
                    Object.values(project.votes[user.name]).reduce((sum, score) => sum + score, 0) / 
                    Object.values(project.votes[user.name]).length
                ).toFixed(2)}</p>
            </div>
        ) : (
            <p>Kendi Puanınız: {project.votes[user.name] || 'Puan verilmedi'}</p>
        )}

        {(user.role === 'admin' || user.role === 'member') && (
            <div>
                <h4>Kullanıcı Yorumları:</h4>
                {project.comments.length > 0 ? (
                    <ul>
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
    /* Verdiğiniz Puan kısmı da güncelleniyor */
    project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
        <div>
            <h4>Verdiğiniz Puanlar:</h4>
            {Object.entries(project.votes[user.name]).map(([criterion, score]) => (
                <p key={criterion}>{criterion}: {score}</p>
            ))}
            
            {/* Calculate and show the average score given by the user */}
            <p><strong>Verdiğiniz Ortalama Puan:</strong> {(
                Object.values(project.votes[user.name]).reduce((sum, score) => sum + score, 0) / 
                Object.values(project.votes[user.name]).length
            ).toFixed(2)}</p>
        </div>
    ) : (
        <p>Verdiğiniz Puan: {project.votes[user.name] || 'Puan verilmedi'}</p>
    )
)}

                        </div>
                        <div className="card-actions" style={{ marginTop: '15px' }}>
                            <button
                                onClick={() => navigate(`/competition/${competitionId}/vote/${project.id}`, { state: { juryMembers, juryVoteCoefficient } })}
                                disabled={!votingStarted || project.votes[user.name]}
                            >
                                {project.votes[user.name] ? 'Oy Kullanıldı' : 'Oy Ver'}
                            </button>
                            {project.votes[user.name] && <p style={{ marginTop: '10px' }}>Bu projeye zaten oy verdiniz.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;
