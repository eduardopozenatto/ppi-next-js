import { Router, type Router as RouterType } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  uploadAvatarHandler,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  requestEmailChange,
  confirmEmailChange,
  requestPhoneChange,
  confirmPhoneChange,
} from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';

const router: RouterType = Router();

// ─── Avatar upload config ────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/avatars'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: MAX_AVATAR_SIZE },
  fileFilter: (_req, file, cb) => {
    if (AVATAR_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.'));
    }
  },
});

// ─── Public routes ───────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ─── Protected routes ────────────────────────────────
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateProfile);
router.post('/avatar', requireAuth, uploadAvatar.single('avatar'), uploadAvatarHandler);
router.post('/change-password', requireAuth, changePassword);
router.post('/request-email-change', requireAuth, requestEmailChange);
router.post('/confirm-email-change', requireAuth, confirmEmailChange);
router.post('/request-phone-change', requireAuth, requestPhoneChange);
router.post('/confirm-phone-change', requireAuth, confirmPhoneChange);

export default router;
