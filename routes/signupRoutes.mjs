// routes/userRoutes.mjs

import { Router } from 'express';
import {
    getUserById,
    signupUser,
    verifyEmail,
} from '../controllers/SignupController.mjs';

const router = Router();

// GET: api/users/:id
router.get('/:id', getUserById);

// POST: api/signup
router.post('/', signupUser);

// POST: api/signup/verify-email
router.post('/verify-email', verifyEmail);

export default router;
