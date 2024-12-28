// Middleware to check user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. User not authenticated.' });
        }

        // Check if the user's role is in the list of allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied. You do not have the required permission.',
            });
        }

        next(); // Proceed to the next middleware or route handler
    };
};

module.exports = { authorizeRoles };
