// controllers/userController.mjs
import bcrypt from 'bcryptjs'; // Import bcryptjs
import User from '../mongoose/schemas/users.mjs'; // Mongoose User model
import { validationResult } from 'express-validator';

// Destructure necessary functions from bcryptjs
const { genSalt, hash } = bcrypt;

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
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
        console.error('Error fetching user:', error);
        res.status(500).send('Internal server error');
    }
};

// Update user by ID
export const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
};

// Create a new user
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

        // Generate password hash and salt
        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);

        // Create new user
        user = new User({
            email,
            passwordHash,
            passwordSalt: salt,
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal server error');
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
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).send('Internal server error');
    }
};

// Logout user
export const logoutUser = (req, res) => {
    try {
        const email = req.user.email;
        // Optionally delete session data from cache
        console.info(`User with email ${email} logged out successfully.`);
        res.status(204).send("sucessfully loggedout"); // No content
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).send('Internal server error');
    }
};
