const express = require("express");
const router = express.Router();
const { Subregion, District, RegionalCoordinator } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all subregions
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subregions = await Subregion.findAll();
    res.json(subregions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific subregion
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subregion = await Subregion.findByPk(req.params.id);
    if (subregion) {
      res.json(subregion);
    } else {
      res.status(404).json({ message: "Subregion not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subregion
router.post(
  "/",
  authMiddleware,
  checkPermission("RegionalCoordinator"),
  async (req, res) => {
    try {
      const subregion = await Subregion.create({
        ...req.body,
        status: "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(subregion);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a subregion
router.put(
  "/:id",
  authMiddleware,
  checkPermission("RegionalCoordinator"),
  async (req, res) => {
    try {
      const subregion = await Subregion.findByPk(req.params.id);
      if (subregion) {
        if (subregion.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved subregion" });
        }
        await subregion.update({
          ...req.body,
          status: "pending",
          updatedBy: req.user.id,
        });
        res.json(subregion);
      } else {
        res.status(404).json({ message: "Subregion not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a subregion
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("RegionalCoordinator"),
  async (req, res) => {
    try {
      const subregion = await Subregion.findByPk(req.params.id);
      if (subregion) {
        if (subregion.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved subregion" });
        }
        await subregion.destroy();
        res.json({ message: "Subregion deleted" });
      } else {
        res.status(404).json({ message: "Subregion not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a subregion (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const subregion = await Subregion.findByPk(req.params.id);
      if (subregion) {
        await subregion.update({ status: "approved", approvedBy: req.user.id });
        res.json(subregion);
      } else {
        res.status(404).json({ message: "Subregion not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all districts in a subregion
router.get("/:subregionId/districts", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const districts = await District.findAll({ where: { subregionId: req.params.subregionId } });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a district in a subregion
router.post("/:subregionId/districts", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const district = await District.create({ ...req.body, subregionId: req.params.subregionId });
    res.status(201).json(district);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all regional coordinators in a subregion
router.get("/:subregionId/regionalCoordinators", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const regionalCoordinators = await RegionalCoordinator.findAll({ where: { subregionId: req.params.subregionId } });
    res.json(regionalCoordinators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a regional coordinator in a subregion
router.post("/:subregionId/regionalCoordinators", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const regionalCoordinator = await RegionalCoordinator.create({ ...req.body, subregionId: req.params.subregionId });
    res.status(201).json(regionalCoordinator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a regional coordinator in a subregion
router.put("/:subregionId/regionalCoordinators/:id", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const regionalCoordinator = await RegionalCoordinator.findByPk(req.params.id);
    if (regionalCoordinator) {
      await regionalCoordinator.update(req.body);
      res.json(regionalCoordinator);
    } else {
      res.status(404).json({ message: "Regional Coordinator not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a regional coordinator in a subregion
router.delete("/:subregionId/regionalCoordinators/:id", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const regionalCoordinator = await RegionalCoordinator.findByPk(req.params.id);
    if (regionalCoordinator) {
      await regionalCoordinator.destroy();
      res.json({ message: "Regional Coordinator deleted" });
    } else {
      res.status(404).json({ message: "Regional Coordinator not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
