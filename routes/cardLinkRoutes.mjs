// routes/cardLinkRoutes.mjs

import { Router } from 'express';
import { verifyToken } from '../middleware/verifyTokenauth.mjs';
import {
    getCardLinks,
    getCardLinkById,
    createCardLink,
    updateCardLink,
    deleteCardLink
} from '../controllers/CardLinksController.mjs';

const router = Router();

// GET: api/card-links
router.get('/', verifyToken, getCardLinks);

// GET: api/card-links/:id
router.get('/:id', verifyToken, getCardLinkById);

// POST: api/card-links
router.post('/', verifyToken, createCardLink);

// PUT: api/card-links/:id
router.put('/:id', verifyToken, updateCardLink);

// DELETE: api/card-links/:id
router.delete('/:id', verifyToken, deleteCardLink);

export default router;
