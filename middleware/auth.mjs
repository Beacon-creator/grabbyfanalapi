import logger from '../middleware/logger.mjs'; // Import the entire logger

// JWT Middleware for authentication
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Invalid token.', error); // Call the logger's error method
        res.status(401).send('Invalid token.');
    }
};

export default auth;
