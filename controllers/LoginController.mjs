// controllers/loginController.mjs

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../mongoose/schemas/User.mjs'; // Mongoose User model

// Function to handle user login
export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        // Find the user by email or phone number
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { phoneNumber: identifier }],
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = createToken(user);

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to create JWT token
const createToken = (user) => {
    const payload = {
        sub: user.email, // Subject is the user's email
        jti: new Date().getTime().toString(), // Unique token identifier
    };

    // JWT configuration (from environment variables)
    const jwtKey = process.env.JWT_KEY;
    const issuer = process.env.ISSUER;
    const audience = process.env.AUDIENCE;

    if (!jwtKey || !issuer || !audience) {
        throw new Error('JWT configuration is missing');
    }

    const token = sign(payload, jwtKey, {
        expiresIn: '30m', // Token expires in 30 minutes
        issuer: issuer,
        audience: audience,
    });

    return token;
};
