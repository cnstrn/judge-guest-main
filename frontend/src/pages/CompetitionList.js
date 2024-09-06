import React from 'react';

function CompetitionList({ projects, resultsVisible, user }) {
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

                                    {project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
                                        <div>
                                            <h4>Kendi Puanlarınız:</h4>
                                            {Object.entries(project.votes[user.name])
                                                .filter(([key]) => key !== 'weightedScore') 
                                                .map(([criterion, score]) => (
                                                    <p key={criterion}>
                                                        {criterion}: {score}
                                                    </p>
                                                ))}

                                            {/* Kullanıcının verdiği ağırlıklı ortalama puanı göster */}
                                            <p>
                                                <strong>Verdiğiniz Ağırlıklı Ortalama Puan:</strong> 
                                                {project.votes[user.name].weightedScore}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>Kendi Puanınız: Puan verilmedi</p>
                                    )}

                                </>
                            ) : (
                                project.votes[user.name] && typeof project.votes[user.name] === 'object' ? (
                                    <div>
                                        <h4>Verdiğiniz Puanlar:</h4>
                                        {Object.entries(project.votes[user.name])
                                            .filter(([key]) => key !== 'weightedScore') 
                                            .map(([criterion, score]) => (
                                                <p key={criterion}>
                                                    {criterion}: {score}
                                                </p>
                                            ))}

                                        {/* Kullanıcının verdiği ağırlıklı ortalama puanı göster */}
                                        <p>
                                            <strong>Verdiğiniz Ağırlıklı Ortalama Puan:</strong> 
                                            {project.votes[user.name].weightedScore.toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Verdiğiniz Puan: Puan verilmedi</p>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompetitionList;
