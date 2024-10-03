// routes/passwordResetRoutes.mjs

import { Router } from 'express';
import {
    sendPasswordResetCode,
    verifyPasswordResetCode,
    resetPassword,
} from '../controllers/PasswordResetController.mjs';

const router = Router();

// POST: api/PasswordReset/send-code
router.post('/send-code', sendPasswordResetCode);

// POST: api/PasswordReset/verify-code
router.post('/verify-code', verifyPasswordResetCode);

// POST: api/PasswordReset/reset-password
router.post('/reset-password', resetPassword);

export default router;
