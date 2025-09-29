// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model if needed

const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database by the ID stored in the token.
      //    This is a critical security step. It prevents users who have been
      //    deleted from accessing the system with an old token.
      //    We also populate the 'tenant' field to enforce multi-tenancy rules later.
      const user = await User.findById(decoded.id).select('-password').populate('tenant');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 4. Attach the full user object and tenant slug to the request.
      //    This makes them easily accessible in your route controllers.
      req.user = user;
      req.tenant = user.tenant; // Attaching the full tenant object can be useful

      // Success! Move on to the next function (the actual route logic).
      return next();

    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};


module.exports = { protect, authorize };