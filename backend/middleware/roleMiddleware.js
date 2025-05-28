// Usage: role('customer') or role('driver')
const role = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
  }
  next();
};

module.exports = role;
