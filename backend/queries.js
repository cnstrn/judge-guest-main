const pool = require('./connection.js')

function checkEmail(email, callback){
    console.log(`${email}`)
    console.log("query");
    const sqlc = `SELECT * FROM users WHERE email = '${email}'`
    pool.query(sqlc, (error, results) => {
        if(error){
            console.log("error");
            error = new Error("Emaili ararken hatayla karşılaşıldı")
            callback(error, true, results)
        } else {
            if(results.rowCount != 0){
                console.log("already exists");
                callback(null, true, results)
            } else {
                console.log("does not exist");
                callback(null, false, results)
            }
        }
    })
}

function addUser(name, email, password, role_requested){
    const sqlc = `INSERT INTO users (name, email, password, role, role_requested) VALUES(
        '${name}', '${email}', '${password}', 'user', '${role_requested}')`;
    pool.query(sqlc);
}

function addComp(name, date, criteria, projects, createdBy){
    const sqlc = `INSERT INTO contests (name, )`;
}

module.exports = {checkEmail, addUser};