const express = require("express");
const router = express.Router();
const { Cell } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all cells
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const cells = await Cell.findAll();
    res.json(cells);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific cell
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const cell = await Cell.findByPk(req.params.id);
    if (cell) {
      res.json(cell);
    } else {
      res.status(404).json({ message: "Cell not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new cell
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const cell = await Cell.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(cell);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a cell
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const cell = await Cell.findByPk(req.params.id);
      if (cell) {
        if (req.user.role !== "SuperAdmin" && cell.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved cell" });
        }
        await cell.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(cell);
      } else {
        res.status(404).json({ message: "Cell not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a cell
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const cell = await Cell.findByPk(req.params.id);
      if (cell) {
        if (req.user.role !== "SuperAdmin" && cell.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved cell" });
        }
        await cell.destroy();
        res.json({ message: "Cell deleted" });
      } else {
        res.status(404).json({ message: "Cell not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a cell (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const cell = await Cell.findByPk(req.params.id);
      if (cell) {
        await cell.update({ status: "approved", approvedBy: req.user.id });
        res.json(cell);
      } else {
        res.status(404).json({ message: "Cell not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
