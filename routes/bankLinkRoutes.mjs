// routes/bankLinkRoutes.js

import { Router } from 'express';
import { verifyToken } from '../middleware/verifyTokenauth.mjs';
import { getBankLinks, getBankLinkById, createBankLink, updateBankLink, deleteBankLink, sendVerificationCode, verifyCode } from '../controllers/bankLinksController.mjs';

const router = Router();

// GET: api/bank-links
router.get('/', verifyToken, getBankLinks);

// GET: api/bank-links/:id
router.get('/:id', verifyToken, getBankLinkById);

// POST: api/bank-links
router.post('/', verifyToken, createBankLink);

// PUT: api/bank-links/:id
router.put('/:id', verifyToken, updateBankLink);

// DELETE: api/bank-links/:id
router.delete('/:id', verifyToken, deleteBankLink);

// POST: api/bank-links/send-verification-code
router.post('/send-verification-code', verifyToken, sendVerificationCode);

// POST: api/bank-links/verify-code
router.post('/verify-code', verifyToken, verifyCode);

export default router;
