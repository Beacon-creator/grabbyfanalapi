import express from 'express';
import bankLinkRoutes from './bankLinkRoutes.mjs';
import cardLinkRoutes from './cardLinkRoutes.mjs';
import passwordResetRoutes from './passwordResetRoutes.mjs';
import signupRoutes from './signupRoutes.mjs';
import userRoutes from './userRoutes.mjs';

const router = express.Router();

router.use('/api/bank-link', bankLinkRoutes);
router.use('/api/card-link', cardLinkRoutes);
router.use('/api/password-reset', passwordResetRoutes);
router.use('/api/signup', signupRoutes);
router.use('/api/users', userRoutes);

export default router;
