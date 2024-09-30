// routes/userRoutes.mjs

import { Router } from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.mjs'; // Authentication middleware
import {
    getAllUsers,
    getUserById,
    updateUserById,
    createUser,
    deleteUserById,
    deleteCurrentUserAccount,
    logoutUser,
} from '../controllers/UserController.mjs';

const router = Router();

// GET: api/users (Get all users)
router.get('/', auth, getAllUsers);

// GET: api/users/:id (Get user by ID)
router.get('/:id', auth, getUserById);

// PUT: api/users/:id (Update user)
router.put('/:id', auth, updateUserById);

// POST: api/users (Create new user)
router.post(
    '/',
    [
        body('email', 'Invalid email').isEmail(),
        body('password', 'Password is required').notEmpty(),
    ],
    createUser
);

// DELETE: api/users/:id (Delete user by ID)
router.delete('/:id', auth, deleteUserById);

// DELETE: api/users/deleteAccount (Delete current user)
router.delete('/deleteAccount', auth, deleteCurrentUserAccount);

// POST: api/users/logout (Logout user)
router.post('/logout', auth, logoutUser);

export default router;
