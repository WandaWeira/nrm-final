const express = require("express");
const router = express.Router();
const { Region, Subregion } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all regions
router.get(
  "/",
  (req, res, next) => {
    next();
  },
  authMiddleware,
  checkPermission("PEO"),
  async (req, res) => {
    try {
      const regions = await Region.findAll();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get a specific region
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ message: "Region not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new region
router.post(
  "/",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const region = await Region.create(req.body);
      res.status(201).json(region);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a region
router.put(
  "/:id",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const region = await Region.findByPk(req.params.id);
      if (region) {
        await region.update(req.body);
        res.json(region);
      } else {
        res.status(404).json({ message: "Region not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a region
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const region = await Region.findByPk(req.params.id);
      if (region) {
        await region.destroy();
        res.json({ message: "Region deleted" });
      } else {
        res.status(404).json({ message: "Region not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all subregions in a region
router.get("/:regionId/subregions", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subregions = await Subregion.findAll({ where: { regionId: req.params.regionId } });
    res.json(subregions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a subregion in a region
router.post("/:regionId/subregions", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const subregion = await Subregion.create({ ...req.body, regionId: req.params.regionId });
    res.status(201).json(subregion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
