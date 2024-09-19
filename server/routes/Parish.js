const express = require("express");
const router = express.Router();
const { Parish, Village, PollingStation } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all parishes
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const parishes = await Parish.findAll();
    res.json(parishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific parish
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const parish = await Parish.findByPk(req.params.id);
    if (parish) {
      res.json(parish);
    } else {
      res.status(404).json({ message: "Parish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new parish
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const parish = await Parish.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(parish);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a parish
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const parish = await Parish.findByPk(req.params.id);
      if (parish) {
        if (req.user.role !== "SuperAdmin" && parish.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved parish" });
        }
        await parish.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(parish);
      } else {
        res.status(404).json({ message: "Parish not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a parish
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const parish = await Parish.findByPk(req.params.id);
      if (parish) {
        if (req.user.role !== "SuperAdmin" && parish.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved parish" });
        }
        await parish.destroy();
        res.json({ message: "Parish deleted" });
      } else {
        res.status(404).json({ message: "Parish not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a parish (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const parish = await Parish.findByPk(req.params.id);
      if (parish) {
        await parish.update({ status: "approved", approvedBy: req.user.id });
        res.json(parish);
      } else {
        res.status(404).json({ message: "Parish not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all villages in a parish
router.get("/:parishId/villages", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const villages = await Village.findAll({ where: { parishId: req.params.parishId } });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a village in a parish
router.post("/:parishId/villages", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const village = await Village.create({ ...req.body, parishId: req.params.parishId });
    res.status(201).json(village);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all polling stations in a parish
router.get("/:parishId/polling-stations", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll({ where: { parishId: req.params.parishId } });
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a polling station in a parish
router.post("/:parishId/polling-stations", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const pollingStation = await PollingStation.create({ ...req.body, parishId: req.params.parishId });
    res.status(201).json(pollingStation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
