const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify token (decoding and verifying in one step)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token. Please authenticate." });
  }
};

const checkPermission = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    // Allow SuperAdmin for all actions
    if (userRole === "SuperAdmin") {
      return next();
    }

    // Allow specific roles based on the required role
    if (Array.isArray(requiredRole)) {
      if (requiredRole.includes(userRole)) {
        return next();
      }
    } else if (userRole === requiredRole) {
      return next();
    }

    // Allow PEO role for GET requests only
    if (userRole === "PEO" && req.method === "GET") {
      return next();
    }

    // Allow DistrictRegistra or RegionalCoordinator for GET requests
    if (
      (userRole === "DistrictRegistra" || userRole === "RegionalCoordinator") &&
      req.method === "GET"
    ) {
      return next();
    }

    // Allow only SuperAdmin to create (POST), update (PUT), or delete (DELETE)
    if (
      (userRole === "DistrictRegistra" || userRole === "RegionalCoordinator") &&
      (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")
    ) {
      return res.status(403).send({
        error: "Awaiting Super admin permissions",
      });
    }

    // Allow DistrictRegistra or RegionalCoordinator to create, update, and delete with pending status
    if (
      (userRole === "DistrictRegistra" || userRole === "RegionalCoordinator") &&
      (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")
    ) {
      req.body.status = "pending"; // Set status to pending for non-GET actions
      return next();
    }

    // If none of the above conditions are met, deny access
    res.status(403).send({ error: "Not authorized to perform this action." });
  };
};

module.exports = { authMiddleware, checkPermission };
