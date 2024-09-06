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
    // Eğer sonuçlar görünürse projeleri ortalama puana göre sırala
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
                            {/* Bu kisimda degisiklikler oldu: Agirlikli puanlar eklendi */}
                            {resultsVisible ? (
                                <>
                                    <p>Ortalama Puan: {project.averageScore.toFixed(2)}</p>

                                    {/* Kullanıcının kendi verdiği puanları ağırlıklı puan hariç göster */}
                                    {project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
                                        <div>
                                            <h4>Kendi Puanlarınız:</h4>
                                            {Object.entries(project.votes[user.name])
                                                .filter(([key]) => key !== 'weightedScore') // Ağırlıklı puanı hariç tut
                                                .map(([criterion, score]) => (
                                                    <p key={criterion}>
                                                        {criterion}: {score}
                                                    </p>
                                                ))}

                                            {/* Kullanıcının verdiği ağırlıklı ortalama puanı göster */}
                                            <p>
                                                <strong>Verdiğiniz Ağırlıklı Ortalama Puan:</strong>{' '}
                                                {(
                                                    project.votes[user.name].weightedScore /
                                                    Object.keys(project.votes[user.name]).length // Kriter sayısına bölerek ortalama al
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>Kendi Puanınız: Puan verilmedi</p>
                                    )}

                                    {/* Admin ya da üye ise yorumları göster */}
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
                                // Oylama sırasında, sonuçlar olmadan verilen puanları göster
                                project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
                                    <div>
                                        <h4>Verdiğiniz Puanlar:</h4>
                                        {Object.entries(project.votes[user.name])
                                            .filter(([key]) => key !== 'weightedScore') // Ağırlıklı puanı hariç tut
                                            .map(([criterion, score]) => (
                                                <p key={criterion}>
                                                    {criterion}: {score}
                                                </p>
                                            ))}

                                        {/* Kullanıcının verdiği ağırlıklı ortalama puanı göster */}
                                        <p>
                                            <strong>Verdiğiniz Ağırlıklı Ortalama Puan:</strong>{' '}
                                            {(
                                                project.votes[user.name].weightedScore // Toplam ağırlıklı puanı göster
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Verdiğiniz Puan: Puan verilmedi</p>
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
                            {project.votes[user.name] && (
                                <p style={{ marginTop: '10px' }}>Bu projeye zaten oy verdiniz.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;
