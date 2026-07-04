import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.json({ success: false, message: "Acces refuzat. Lipseste token-ul de administrator!" })
        }
        
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Token invalid. Sesiune neautorizata!" })
        }

        next()
    } catch (error) {
        console.error("Eroare middleware admin:", error)
        res.json({ success: false, message: "Eroare de autentificare operator." })
    }
}

export default authAdmin