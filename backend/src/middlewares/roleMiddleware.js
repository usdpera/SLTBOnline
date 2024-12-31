const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. User not authenticated.' });
        }

        // Match the single role in req.user.role against allowedRoles
        if (!allowedRoles.includes(req.user.role)) {
            console.log(`Role mismatch: ${req.user.role} not in ${allowedRoles}`); // Debug log
            return res.status(403).json({ 
                error: 'Access denied. You do not have the required permission.' 
            });
        }

        next(); // Proceed to the next middleware or route handler
    };
};

module.exports = { authorizeRoles };
