const process = require('./keys.json')
const webtok = require('jsonwebtoken')

const admin = (req, res, next) => {
    try{
        console.log("Admin yetkilendirmesi aranıyor...");
        const atok = req.headers.authorization;
        const decodedtk = webtok.verify(atok, process.env.JWT_A);
        req.userDec = decodedtk
        next()
    } catch(error) {
        res.status(401).json({
            message: "Yetkilendirme başarısız."
        });
    }
}

const member = (req, res, next) => {
    try{
        console.log("Member yetkilendirmesi aranıyor...")
        const atok = req.headers.authorization
        const decodedtk = webtok.verify(atok, process.env.JWT_M)
        req.userDec = decodedtk
        next()
    } catch(error) {
        res.status(401).json({
            message: "Yetkilendirme başarısız."
        });
    }
}

const user = (req, res, next) => {
    try{
        console.log("User yetkilendirmesi aranıyor...")
        const atok = req.headers.authorization
        const decodedtk = webtok.verify(atok, process.env.JWT_U);
        req.userDec = decodedtk
        next()
    } catch(error) {
        res.status(401).json({
            message: "Yetkilendirme başarısız."
        });
    }
}

const authorize = (req, res, next) => {
    try {
        console.log("Token kontrol ediliyor..");
        const utok = req.headers.authorization; //gets the token from the request header, utok stands for user token
        const validKeys = [process.env.JWT_KEYA, process.env.JWT_KEYM, process.env.JWT_KEYU]; //has both keys to compare
        for(const key of validKeys){ //does it for both types of keys, does the admin one first
            try {
                const decodedtk = webtok.verify(utok, key); //checks whether the token was made using either "admin" or "user" key
                req.userDec = decodedtk; //passes the token verification as an attribute in the request
                next();
                return;
            } catch(error) {
            }
        }
        throw new Error("Geçersiz token")
    } catch(error) {
        res.status(401).json({
            message: "Yetkilendirme başarısız."
        });
    }   
}