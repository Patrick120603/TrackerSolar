import telemetrieModel from "../models/telemetrieModel.js";

const salveazaTelemetrie = async (req, res) => {
    try {
        const { orizontal, vertical, tensiune, curent, mod } = req.query;

        if (!orizontal || !vertical) {
            return res.status(400).json({
                success: false,
                message: "Lipsesc unghiurile transmise de servomotoare."
            });
        }
        const valOrizontal = isNaN(Number(orizontal)) ? 90 : Number(orizontal);
        const valVertical = isNaN(Number(vertical)) ? 90 : Number(vertical);
        const valTensiune = isNaN(Number(tensiune)) ? 0 : Number(tensiune);
        const valCurent = isNaN(Number(curent)) ? 0 : Number(curent);
        const nouaInregistrare = new telemetrieModel({
            unghiOrizontal: valOrizontal,
            unghiVertical: valVertical,
            tensiunePanou: valTensiune,
            curentProdus: valCurent,
            modFunctionare: mod || "AUTOMAT_LDR"
        });

        await nouaInregistrare.save();

        console.log(`[DATABASE] Telemetrie salvata cu succes! Orizontal: ${valOrizontal}°, Vertical: ${valVertical}°, Curent: ${valCurent}mA`);

        const acum = new Date();
        return res.status(200).json({
            success: true,
            setMod: global.stareModSistem,
            setH: global.manualUnghiH,
            setV: global.manualUnghiV,
            epoch: Math.floor(Date.now() / 1000),
            an: acum.getFullYear(),
            luna: acum.getMonth() + 1,
            zi: acum.getDate(),
            ora: acum.getHours(),
            minut: acum.getMinutes(),
            secunda: acum.getSeconds()
        });

    } catch (error) {
        console.error("Eroare la salvarea datelor de pe Arduino:", error);
        return res.status(500).json({
            success: false,
            message: "Eroare internă de server la procesarea telemetriei."
        });
    }
};
const obtineIstoricTelemetrie = async (req, res) => {
    try {
        const istoric = await telemetrieModel.find({})
            .sort({ timestamp: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            date: istoric
        });

    } catch (error) {
        console.error("Eroare la extragerea istoricului din baza de date:", error);
        return res.status(500).json({
            success: false,
            message: "Nu s-a putut genera istoricul de telemetrie."
        });
    }
};

export {
    salveazaTelemetrie,
    obtineIstoricTelemetrie
};