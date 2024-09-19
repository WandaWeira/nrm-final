const express = require("express");
const router = express.Router();
const { Village } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all villages
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const villages = await Village.findAll();
    res.json(villages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific village
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const village = await Village.findByPk(req.params.id);
    if (village) {
      res.json(village);
    } else {
      res.status(404).json({ message: "Village not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new village
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const village = await Village.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(village);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a village
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const village = await Village.findByPk(req.params.id);
      if (village) {
        if (req.user.role !== "SuperAdmin" && village.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved village" });
        }
        await village.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(village);
      } else {
        res.status(404).json({ message: "Village not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a village
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const village = await Village.findByPk(req.params.id);
      if (village) {
        if (req.user.role !== "SuperAdmin" && village.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved village" });
        }
        await village.destroy();
        res.json({ message: "Village deleted" });
      } else {
        res.status(404).json({ message: "Village not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a village (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const village = await Village.findByPk(req.params.id);
      if (village) {
        await village.update({ status: "approved", approvedBy: req.user.id });
        res.json(village);
      } else {
        res.status(404).json({ message: "Village not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
