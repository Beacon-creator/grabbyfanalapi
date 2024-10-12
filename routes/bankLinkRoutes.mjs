// routes/bankLinkRoutes.js

import { Router } from 'express';
import { verifyToken } from '../middleware/verifyTokenauth.mjs';
import { getBankLinks, getBankLinkById, createBankLink, updateBankLink, deleteBankLink, sendVerificationCode, verifyCode } from '../controllers/bankLinksController.mjs';

const router = Router();

// GET: api/bank-link
router.get('/', verifyToken, getBankLinks);

// GET: api/bank-link/:id
router.get('/:id', verifyToken, getBankLinkById);

// POST: api/bank-link
router.post('/', verifyToken, createBankLink);

// PUT: api/bank-link/:id
router.put('/:id', verifyToken, updateBankLink);

// DELETE: api/bank-link/:id
router.delete('/:id', verifyToken, deleteBankLink);

// POST: api/bank-link/send-verification-code
router.post('/send-verification-code', verifyToken, sendVerificationCode);

// POST: api/bank-link/verify-code
router.post('/verify-code', verifyToken, verifyCode);

export default router;
