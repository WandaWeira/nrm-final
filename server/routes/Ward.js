const express = require("express");
const router = express.Router();
const { Ward, Cell } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all wards
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const wards = await Ward.findAll();
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific ward
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const ward = await Ward.findByPk(req.params.id);
    if (ward) {
      res.json(ward);
    } else {
      res.status(404).json({ message: "Ward not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new ward
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(ward);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a ward
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        if (req.user.role !== "SuperAdmin" && ward.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved ward" });
        }
        await ward.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(ward);
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a ward
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        if (req.user.role !== "SuperAdmin" && ward.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved ward" });
        }
        await ward.destroy();
        res.json({ message: "Ward deleted" });
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a ward (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        await ward.update({ status: "approved", approvedBy: req.user.id });
        res.json(ward);
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all cells in a ward
router.get(
  "/:wardId/cells",
  authMiddleware,
  checkPermission("PEO"),
  async (req, res) => {
    try {
      const cells = await Cell.findAll({
        where: { wardId: req.params.wardId },
      });
      res.json(cells);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Create a cell in a ward
router.post(
  "/:wardId/cells",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const cell = await Cell.create({
        ...req.body,
        wardId: req.params.wardId,
      });
      res.status(201).json(cell);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
