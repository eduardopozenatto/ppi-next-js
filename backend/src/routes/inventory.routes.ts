import { Router, type Router as RouterType } from 'express';
import {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  uploadImage
} from '../controllers/inventory.controller';
import { requireAuth, requirePermission } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';

const router: RouterType = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.'));
    }
  },
});

router.get('/', listItems);
router.get('/:id', getItemById);

router.use(requireAuth);
// A permissão "manipular_estoque" é do estagiario. A "gerenciar_itens" é do lab. 
// Vamos exigir "manipular_estoque" pois é o degrau menor para inventário ou "gerenciar_itens" no Auth middleware
router.post('/', requirePermission('manipular_estoque'), createItem);
router.put('/:id', requirePermission('manipular_estoque'), updateItem);
router.delete('/:id', requirePermission('manipular_estoque'), deleteItem);
router.post(
  '/:id/image',
  requirePermission('manipular_estoque'),
  upload.single('image'),
  uploadImage
);

export default router;
