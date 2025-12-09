export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔒 Role authorization middleware called");
    console.log("👤 User role:", req.user?.role);
    console.log("🎭 Required roles:", roles);
    
    if (!roles.includes(req.user?.role || "")) {
      console.log("❌ Role authorization failed");
      return res.status(403).json({
        message: `Role ${req.user?.role} is not allowed to access this resource`,
      });
    }
    
    console.log("✅ Role authorization successful");
    next();
  };
};
