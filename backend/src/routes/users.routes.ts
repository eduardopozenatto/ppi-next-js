import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/auth';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPermissionOverride,
} from '../controllers/users.controller';

const router: RouterType = Router();

router.use(requireAuth);
// Admin ou 'gerenciar_usuarios'
router.use(requirePermission('gerenciar_usuarios'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Rota específica para override de permissão
router.put('/:id/permissions/:tagId', updateUserPermissionOverride);

export default router;
