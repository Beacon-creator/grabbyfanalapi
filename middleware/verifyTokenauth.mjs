import { verify } from 'jsonwebtoken';
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing.' });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export default { verifyToken };
