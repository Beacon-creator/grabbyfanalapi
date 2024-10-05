import jwt from 'jsonwebtoken'; // Default import of jsonwebtoken
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header (Bearer token format)
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

    // If no token, deny access
    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing.' });
    }

    try {
        // Verify token using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies the token and decodes it
        
        // Attach the decoded token to the request (so you can use it in your routes)
        req.user = decoded;

        // Proceed to the next middleware
        next();
    } catch (error) {
        // Handle invalid or expired tokens
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Export as default
export default verifyToken;
