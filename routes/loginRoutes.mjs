// routes/loginRoutes.mjs

import { Router } from 'express';
import { loginUser } from '../controllers/LoginController.mjs';

const router = Router();

// POST: api/login
router.post('/', loginUser);

export default router;
