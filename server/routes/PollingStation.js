const express = require("express");
const router = express.Router();
const { PollingStation } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all polling stations
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll();
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific polling station
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id);
    if (pollingStation) {
      res.json(pollingStation);
    } else {
      res.status(404).json({ message: "Polling Station not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new polling station
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const pollingStation = await PollingStation.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(pollingStation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a polling station
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const pollingStation = await PollingStation.findByPk(req.params.id);
      if (pollingStation) {
        if (req.user.role !== "SuperAdmin" && pollingStation.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved polling station" });
        }
        await pollingStation.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(pollingStation);
      } else {
        res.status(404).json({ message: "Polling Station not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a polling station
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const pollingStation = await PollingStation.findByPk(req.params.id);
      if (pollingStation) {
        if (req.user.role !== "SuperAdmin" && pollingStation.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved polling station" });
        }
        await pollingStation.destroy();
        res.json({ message: "Polling Station deleted" });
      } else {
        res.status(404).json({ message: "Polling Station not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a polling station (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const pollingStation = await PollingStation.findByPk(req.params.id);
      if (pollingStation) {
        await pollingStation.update({ status: "approved", approvedBy: req.user.id });
        res.json(pollingStation);
      } else {
        res.status(404).json({ message: "Polling Station not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
