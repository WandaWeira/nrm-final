const express = require("express");
const router = express.Router();
const { Constituency, Subcounty } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all constituencies
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const constituencies = await Constituency.findAll();
    res.json(constituencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific constituency
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const constituency = await Constituency.findByPk(req.params.id);
    if (constituency) {
      res.json(constituency);
    } else {
      res.status(404).json({ message: "Constituency not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new constituency
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const constituency = await Constituency.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(constituency);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a constituency
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const constituency = await Constituency.findByPk(req.params.id);
      if (constituency) {
        if (
          req.user.role !== "SuperAdmin" &&
          constituency.status === "approved"
        ) {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved constituency" });
        }
        await constituency.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(constituency);
      } else {
        res.status(404).json({ message: "Constituency not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a constituency
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const constituency = await Constituency.findByPk(req.params.id);
      if (constituency) {
        if (
          req.user.role !== "SuperAdmin" &&
          constituency.status === "approved"
        ) {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved constituency" });
        }
        await constituency.destroy();
        res.json({ message: "Constituency deleted" });
      } else {
        res.status(404).json({ message: "Constituency not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a constituency (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const constituency = await Constituency.findByPk(req.params.id);
      if (constituency) {
        await constituency.update({
          status: "approved",
          approvedBy: req.user.id,
        });
        res.json(constituency);
      } else {
        res.status(404).json({ message: "Constituency not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all subcounties in a constituency
router.get("/:constituencyId/subcounties", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subcounties = await Subcounty.findAll({ where: { constituencyId: req.params.constituencyId } });
    res.json(subcounties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a subcounty in a constituency
router.post("/:constituencyId/subcounties", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const subcounty = await Subcounty.create({ ...req.body, constituencyId: req.params.constituencyId });
    res.status(201).json(subcounty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
