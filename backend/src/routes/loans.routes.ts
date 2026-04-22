import { Router, type Router as RouterType } from 'express';
import {
  listLoans,
  createLoan,
  updateLoanStatus,
} from '../controllers/loans.controller';
import { requireAuth, requirePermission } from '../middlewares/auth';

const router: RouterType = Router();

router.use(requireAuth);

router.get('/', listLoans);
router.post('/', requirePermission('pedir_emprestimos'), createLoan);
router.put('/:id/status', requirePermission('aprovar_emprestimos'), updateLoanStatus);

export default router;
