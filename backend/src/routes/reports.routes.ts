import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/auth';
import {
  getInventoryReport,
  getLoansReport,
} from '../controllers/reports.controller';

const router: RouterType = Router();

router.use(requireAuth);
router.use(requirePermission('gerar_relatorios'));

router.get('/inventory', getInventoryReport);
router.get('/loans', getLoansReport);

export default router;
