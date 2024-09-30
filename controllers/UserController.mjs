// controllers/userController.mjs
import pkg from 'bcryptjs'; // Import the entire bcryptjs module
import User from '../mongoose/schemas/users.mjs'; // Mongoose User model
import { validationResult } from 'express-validator';
//import { logger } from '../middleware/logger.mjs'; // Winston logger


const { genSalt, hash } = pkg; // Destructure what you need from the bcryptjs package
// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        _error('Error occurred while fetching users.', error);
        res.status(500).send('Internal server error.');
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        _error('Error occurred while fetching user.', error);
        res.status(500).send('Internal server error.');
    }
};

// Update user
export const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        _error('Error occurred while updating user.', error);
        res.status(500).send('Internal server error.');
    }
};

// Create new user
export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
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
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while deleting user.', error);
        res.status(500).send('Internal server error.');
    }
};

// Delete current user's account
export const deleteCurrentUserAccount = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while deleting account.', error);
        res.status(500).send('Internal server error.');
    }
};

// Logout user
export const logoutUser = (req, res) => {
    try {
        const email = req.user.email;
        cache.delete(email); // Remove session from cache
        info(`User with email ${email} logged out successfully.`);
        res.status(204).send();
    } catch (error) {
        _error('Error occurred while logging out.', error);
        res.status(500).send('Internal server error.');
    }
};
