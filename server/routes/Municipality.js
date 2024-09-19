const express = require("express");
const router = express.Router();
const { Municipality, Ward } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all municipalities
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const municipalities = await Municipality.findAll();
    res.json(municipalities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific municipality
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const municipality = await Municipality.findByPk(req.params.id);
    if (municipality) {
      res.json(municipality);
    } else {
      res.status(404).json({ message: "Municipality not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new municipality
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const municipality = await Municipality.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(municipality);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a municipality
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const municipality = await Municipality.findByPk(req.params.id);
      if (municipality) {
        if (
          req.user.role !== "SuperAdmin" &&
          municipality.status === "approved"
        ) {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved municipality" });
        }
        await municipality.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(municipality);
      } else {
        res.status(404).json({ message: "Municipality not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a municipality
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const municipality = await Municipality.findByPk(req.params.id);
      if (municipality) {
        if (
          req.user.role !== "SuperAdmin" &&
          municipality.status === "approved"
        ) {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved municipality" });
        }
        await municipality.destroy();
        res.json({ message: "Municipality deleted" });
      } else {
        res.status(404).json({ message: "Municipality not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a municipality (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const municipality = await Municipality.findByPk(req.params.id);
      if (municipality) {
        await municipality.update({
          status: "approved",
          approvedBy: req.user.id,
        });
        res.json(municipality);
      } else {
        res.status(404).json({ message: "Municipality not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);


// Get all wards in a municipality
router.get("/:municipalityId/wards", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const wards = await Ward.findAll({ where: { municipalityId: req.params.municipalityId } });
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a ward in a municipality
router.post("/:municipalityId/wards", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const ward = await Ward.create({ ...req.body, municipalityId: req.params.municipalityId });
    res.status(201).json(ward);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
