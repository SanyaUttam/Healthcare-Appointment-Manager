const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify the active JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer <token>
      token = req.headers.authorization.split(' ')[1];

      // Verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB without returning the password string
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Role-Based Access Control (RBAC) middleware generator
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user ? req.user.role : 'none'}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };