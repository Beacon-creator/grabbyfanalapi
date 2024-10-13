import jwt from 'jsonwebtoken'; // Import jsonwebtoken for verifying the token
import logger from '../middleware/logger.mjs'; // Import the entire logger
import dotenv from 'dotenv';

// JWT Middleware for authentication
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        // Use jwt.verify to verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Invalid token.', error); // Call the logger's error method
        res.status(401).send('Invalid token.');
    }
};

export default auth;
