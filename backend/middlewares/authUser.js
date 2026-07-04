import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Sesiune expirata. Te rugam sa te reconectezi!" })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id

        next()
    } catch (error) {
        console.error("Eroare middleware operator:", error)
        res.json({ success: false, message: "Sesiune invalida." })
    }
}

export default authUser
