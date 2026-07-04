import express from 'express';
import { salveazaTelemetrie, obtineIstoricTelemetrie } from '../controllers/telemetrieController.js';

const telemetrieRouter = express.Router();

telemetrieRouter.get('/salveaza', salveazaTelemetrie);
telemetrieRouter.get('/list', obtineIstoricTelemetrie);

export default telemetrieRouter;