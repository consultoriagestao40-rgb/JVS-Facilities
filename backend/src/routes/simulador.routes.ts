import { Router } from 'express';
import { SimuladorController } from '../controllers/simuladorController';

const router = Router();
const simuladorController = new SimuladorController();

router.post('/calcular', simuladorController.calcular);
router.post('/salvar', simuladorController.salvar);
router.get('/leads', simuladorController.listarLeads);

export default router;
