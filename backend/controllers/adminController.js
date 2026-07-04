import jwt from 'jsonwebtoken'

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            
            return res.status(200).json({ 
                success: true, 
                token, 
                message: "Autentificare reușită! Bine ai venit în panoul de control SolarTrack." 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Date de autentificare incorecte. Acces refuzat!" 
            });
        }

    } catch (error) {
        console.error("Eroare la logare admin:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Eroare internă de server la încercarea de autentificare." 
        });
    }
}

export { loginAdmin }