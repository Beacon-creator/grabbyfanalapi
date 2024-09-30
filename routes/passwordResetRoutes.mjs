// routes/passwordResetRoutes.mjs

import { Router } from 'express';
import {
    sendPasswordResetCode,
    verifyPasswordResetCode,
    resetPassword,
} from '../controllers/passwordResetController.mjs';

const router = Router();

// POST: api/password-reset/send-code
router.post('/send-code', sendPasswordResetCode);

// POST: api/password-reset/verify-code
router.post('/verify-code', verifyPasswordResetCode);

// POST: api/password-reset/reset-password
router.post('/reset-password', resetPassword);

export default router;
