import { Router } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User, { find, findById, findByIdAndUpdate, findOne, findByIdAndDelete, findOneAndDelete } from '../models/User'; // Your Mongoose User model
import { error as _error, info } from '../config/logger'; // Winston logger config
import auth from '../middleware/auth'; // Middleware for token-based authentication
const router = Router();
const cache = new Map(); // In-memory cache replacement (for simplicity)
require('dotenv').config();

// GET: api/users (Get all users)
router.get('/', auth, async (req, res) => {
    try {
        const users = await find();
        res.json(users);
    } catch (error) {
        _error('Error occurred while fetching users.', error);
        res.status(500).send('Internal server error.');
    }
});

// GET: api/users/:id (Get user by ID)
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        _error('Error occurred while fetching user.', error);
        res.status(500).send('Internal server error.');
    }
});

// PUT: api/users/:id (Update user)
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        _error('Error occurred while updating user.', error);
        res.status(500).send('Internal server error.');
    }
});

// POST: api/users (Create new user)
router.post(
    '/',
    [
        body('email', 'Invalid email').isEmail(),
        body('password', 'Password is required').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user already exists
            let user = await findOne({ email });
            if (user) {
                return res.status(400).send('User already exists');
            }

            // Hash the password
            const salt = await genSalt(10);
            const passwordHash = await hash(password, salt);

            user = new User({
                email,
                passwordHash,
                passwordSalt: salt,
            });

            await user.save();
            res.status(201).json(user);
        } catch (error) {
            _error('Error occurred while creating user.', error);
            res.status(500).send('Internal server error.');
        }
    }
);

// DELETE: api/users/:id (Delete user by ID)
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while deleting user.', error);
        res.status(500).send('Internal server error.');
    }
});

// DELETE: api/users/deleteAccount (Delete current user)
router.delete('/deleteAccount', auth, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await findOneAndDelete({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while deleting account.', error);
        res.status(500).send('Internal server error.');
    }
});

// POST: api/users/logout (Logout user)
router.post('/logout', auth, (req, res) => {
    try {
        const email = req.user.email;
        cache.delete(email); // Remove session from cache
        info(`User with email ${email} logged out successfully.`);
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while logging out.', error);
        res.status(500).send('Internal server error.');
    }
});

// JWT Middleware for authentication
function verifyToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Invalid token.');
    }
}

export default router;
