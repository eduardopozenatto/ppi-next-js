import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/auth';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from '../controllers/tags.controller';

const router: RouterType = Router();

router.use(requireAuth);
// O gerenciamento de tags normalmente requer admin, mas a tag controla roles e permissions
// Vamos exigir 'gerenciar_roles' para mexer com elas.
router.use(requirePermission('gerenciar_roles'));

router.get('/', getTags);
router.get('/:id', getTagById);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
