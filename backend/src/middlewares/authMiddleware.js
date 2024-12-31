const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debugging log

        // Attach the decoded data to the request object
        req.user = {
            id: decoded.id,
            role: decoded.role, // Note: 'role' is a single string in your token
        };

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

module.exports = { authenticateUser };
