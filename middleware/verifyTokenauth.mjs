import jwt from 'jsonwebtoken'; // Default import
import dotenv from 'dotenv';

dotenv.config(); 

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};
export default verifyToken;
