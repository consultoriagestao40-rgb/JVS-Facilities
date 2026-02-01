import { Router } from 'express';
import { SimuladorController } from '../controllers/simuladorController';

const router = Router();
const simuladorController = new SimuladorController();

router.post('/calcular', simuladorController.calcular);

export default router;
