import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/auth';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller';

const router: RouterType = Router();

router.use(requireAuth);

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rotas de modificação exigem permissão específica
router.post('/', requirePermission('gerenciar_categorias'), createCategory);
router.put('/:id', requirePermission('gerenciar_categorias'), updateCategory);
router.delete('/:id', requirePermission('gerenciar_categorias'), deleteCategory);

export default router;
