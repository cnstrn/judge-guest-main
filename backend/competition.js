// yarisma mantigi ile ilgili socket eventlerini içerir
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checks = require('./queries.js');
const process = require("./keys.json"); //gets the token keys

let competitions = {};

// Yarisma kodu generate eder (6 haneli)
function generateCompetitionCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}



function handleSocketEvents(socket, io) {

    socket.on('signUp', ({ name, email, password, role }) => {
        console.log("kullanıcı kayıdı")
        checks.checkEmail(email, (error, det, results) => {
            if(error){
                console.log("email hata");
                console.log(det);
            }
            if(!error && !det){
                bcrypt.hash(password, 10, (error, hash) => {
                    if(error){
                        console.log("hash yaparken hata");
                    } else {
                        checks.addUser(name, email, hash, role);
                    }
                });
                console.log("kayıt başarılı");
                socket.emit('signUp-confirm');
            }
        });
    });

    socket.on('login-request', ({ email, password})=>{
        checks.checkEmail(email, (error, det, results) => {
            if(!error && !det){
                console.log("bağlı değil")
                const message = "Bu email bir hesaba bağlı değil";
                socket.emit('login-reject', (message));
            } else if(!error && det){
                console.log("hesap bulundu")
                bcrypt.compare(password, results.rows[0].password, (error, res) => {
                    console.log("şifre doğru");
                    if(!error & res){
                        const name = results.rows[0].name;
                        const email = results.rows[0].email;
                        const password = results.rows[0].password;
                        const role = results.rows[0].role;
                        if(role == "user"){
                            const tok = jwt.sign({
                                name: name,
                                email: email,
                                role: role
                            }, process.env.JWT_U, {
                                expiresIn: "2h"
                            });
                        socket.emit('login-confirm', {name, email, role, tok});
                        } else if(role == "member") {
                            const tok = jwt.sign({
                                name: name,
                                email: email,
                                role: role
                            }, process.env.JWT_M, {
                                expiresIn: "2h"
                            });
                        socket.emit('login-confirm', {name, email, role, tok});
                        } else if(role == "admin") {
                            const tok = jwt.sign({
                                name: name,
                                email: email,
                                role: role
                            }, process.env.JWT_A, {
                                expiresIn: "2h"
                            });
                        socket.emit('login-confirm', {name, email, role, tok});
                        } else {
                            const message = "Henüz rolünüz tanımlanmadı."
                            socket.emit('login-reject', (message));
                        }
                    }
                })
            }
        })
    });

    // Yarisma yaratma
    socket.on('createCompetition', ({ name, date, criteria, projects, createdBy }) => {
        const competitionId = generateCompetitionCode();
        competitions[competitionId] = {
            name,
            date, 
            criteria,
            projects: projects.map(project => ({
                ...project,
                totalScore: 0,
                voteCount: 0,
                averageScore: 0,
                votes: {},
                comments: []
            })),
            createdBy,
            connectedUsers: [],
            juryMembers: [],
            votingStarted: false,
            votingFinished: false,
            resultsVisible: false
        };

        //checks.addComp(name, date, criteria, projects, createdBy);
    
        console.log(`Competition created: ${competitionId}`, competitions[competitionId]);
    
        socket.join(competitionId);
        socket.emit('competitionCreated', competitionId);
    });

    // yarismaya katilma
    socket.on('joinCompetition', ({ competitionId, name }) => {
        if (competitions[competitionId]) {
            const competition = competitions[competitionId];

            const userExists = competition.connectedUsers.some((user) => user.name === name);
            if (!userExists) {
                competition.connectedUsers.push({ name });
            }

            socket.join(competitionId);
            io.in(competitionId).emit('competitionData', competition);
            console.log(`User ${name} joined competition: ${competitionId}`);
        } else {
            socket.emit('error', 'Competition not found');
            console.log(`Competition not found: ${competitionId}`);
        }
    });

    // competition data requesti
    socket.on('requestCompetitionData', ({ competitionId }) => {
        const competition = competitions[competitionId];
        if (competition) {
            console.log(`Sending competition data for competitionId: ${competitionId}`);
            socket.emit('competitionData', competition);
        } else {
            console.log(`No competition found with competitionId: ${competitionId}`);
            socket.emit('error', 'Competition not found');
        }
    });

    // Jury ataması
    socket.on('updateJuryMembers', ({ competitionId, juryMembers }) => {
        if (competitions[competitionId]) {
            competitions[competitionId].juryMembers = juryMembers;
            io.in(competitionId).emit('competitionData', competitions[competitionId]);
            console.log(`Updated jury members for competition: ${competitionId}`);
        }
    });

    // Oylamayı başlatma
    socket.on('startVoting', ({ competitionId }) => {
        if (competitions[competitionId]) {
            competitions[competitionId].votingStarted = true;
            io.in(competitionId).emit('competitionData', competitions[competitionId]);
            console.log(`Voting started for competition: ${competitionId}`);
        }
    });

    // Oylamayı bitirme
    socket.on('finishVoting', ({ competitionId }) => {
        if (competitions[competitionId]) {
            competitions[competitionId].votingFinished = true;
            competitions[competitionId].votingStarted = false;
            io.in(competitionId).emit('competitionData', competitions[competitionId]);
            console.log(`Voting finished for competition: ${competitionId}`);
        }
    });

    // Sonuçların gosterilmesi
    socket.on('showResults', ({ competitionId }) => {
        if (competitions[competitionId]) {
            competitions[competitionId].resultsVisible = true;
            io.in(competitionId).emit('competitionData', competitions[competitionId]);
            console.log(`Results made visible for competition: ${competitionId}`);
        }
    });

    // Oyların submit edilmesi
    socket.on('submitVotes', ({ competitionId, projectId, finalScore, userName, comment }) => {
        const competition = competitions[competitionId];
        if (competition) {
            const project = competition.projects.find(p => p.id === projectId);
            if (project) {
                project.votes[userName] = finalScore;
                if (comment) {
                    project.comments.push({ userName, comment });
                }

                project.totalScore += finalScore;
                project.voteCount += 1;
                project.averageScore = project.totalScore / project.voteCount;

                console.log(`User ${userName} voted on project ${projectId}: ${finalScore}`);
                console.log(`Updated average score for project ${projectId}: ${project.averageScore}`);

                io.in(competitionId).emit('competitionData', competition);
            }
        }
    });
}

module.exports = {
    generateCompetitionCode,
    handleSocketEvents
};
