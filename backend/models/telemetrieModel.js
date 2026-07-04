import mongoose from "mongoose";

const telemetrieSchema = new mongoose.Schema({
    unghiOrizontal: { type: Number, required: true },
    unghiVertical: { type: Number, required: true },
    
    tensiunePanou: { type: Number, default: 0 },
    curentProdus: { type: Number, default: 0 },
    
    modFunctionare: { type: String, default: "AUTOMAT_LDR" }, 
    
    timestamp: { type: Date, default: Date.now }
}, { minimize: false })

const telemetrieModel = mongoose.models.telemetrie || mongoose.model('telemetrie', telemetrieSchema);

export default telemetrieModel;