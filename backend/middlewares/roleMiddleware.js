const { AppError } = require('./errorMiddleware');

/**
 * Authorize access based on user roles.
 * Must be used AFTER the protect middleware.
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'inspector', 'farmer')
 * @returns Express middleware
 *
 * Usage: router.get('/admin-only', protect, authorize('admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.farmer is set by the protect middleware (farmer auth)
    // req.user is set by the protectAdmin middleware (admin auth)
    const currentUser = req.user || req.farmer;

    if (!currentUser) {
      return next(new AppError('Not authorized — no user context', 401));
    }

    const userRole = currentUser.role || 'farmer';

    if (!roles.includes(userRole)) {
      return next(
        new AppError(
          `Role '${userRole}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};

module.exports = { authorize };
