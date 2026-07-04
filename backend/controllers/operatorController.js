import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Te rugăm să completezi toate câmpurile." });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Acest email de operator este deja înregistrat." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nouOperator = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await nouOperator.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return res.status(201).json({ success: true, token, message: "Cont de operator creat cu succes!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Eroare la înregistrarea operatorului." });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Operatorul nu a fost găsit în sistem." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({ success: true, token, message: "Conectat cu succes la panoul SolarTrack!" });
        } else {
            return res.json({ success: false, message: "Parolă incorectă!" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Eroare la logare operator." });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        return res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Nu s-a putut încărca profilul." });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        
        if (!name) {
            return res.json({ success: false, message: "Numele este obligatoriu." });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address, dob, gender });
        return res.json({ success: true, message: "Profil de operator actualizat cu succes!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Eroare la actualizarea datelor." });
    }
}

const actualizeazaModSistem = async (req, res) => {
    try {
        const { mod } = req.body;
        
        if (mod === undefined || mod === null) {
            return res.json({ success: false, message: "Lipseste valoarea modului selectat." });
        }

        global.stareModSistem = Number(mod);
        console.log(`[COMMAND] Modul trackerului a fost schimbat din interfața React la: Mod ${global.stareModSistem}`);

        return res.json({ 
            success: true, 
            message: `Sistemul a comutat pe Modul ${global.stareModSistem}` 
        });
    } catch (error) {
        console.error("Eroare la actualizarea modului hardware:", error);
        return res.status(500).json({ success: false, message: "Eroare de server la procesarea comenzii." });
    }
};

const actualizeazaUnghiuriSistem = async (req, res) => {
    try {
        const { unghiH, unghiV } = req.body;

        if (unghiH === undefined || unghiV === undefined) {
            return res.json({ success: false, message: "Lipsesc coordonatele axelor." });
        }

        global.manualUnghiH = Number(unghiH);
        global.manualUnghiV = Number(unghiV);

        console.log(`[MANUAL] Unghiuri noi setate de pe site -> Orizontal: ${global.manualUnghiH}°, Vertical: ${global.manualUnghiV}°`);

        return res.json({ success: true, message: "Coordonate manuale transmise." });
    } catch (error) {
        console.error("Eroare la setarea unghiurilor manuale:", error);
        return res.status(500).json({ success: false, message: "Eroare de server la procesarea directiei." });
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    actualizeazaModSistem,
    actualizeazaUnghiuriSistem
}