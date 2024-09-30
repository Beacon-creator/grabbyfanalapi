import express from 'express';
import bankLinkRoutes from './bankLinkRoutes.mjs';
import cardLinkRoutes from './cardLinkRoutes.mjs';
import passwordResetRoutes from './passwordResetRoutes.mjs';
import signupRoutes from './signupRoutes.mjs';
import userRoutes from './userRoutes.mjs';

const router = express.Router();

router.use('/bank-links', bankLinkRoutes);
router.use('/card-links', cardLinkRoutes);
router.use('/password-resets', passwordResetRoutes);
router.use('/sign-up', signupRoutes);
router.use('/users', userRoutes);

export default router;
