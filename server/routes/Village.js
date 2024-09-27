const express = require("express");
const router = express.Router();
const { Village, VillageRegistra } = require("../models");
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

// ... existing code ...

// Get all registrars for a village
router.get(
  "/:villageId/registrars",
  authMiddleware,
  checkPermission("PEO"),
  async (req, res) => {
    try {
      const registrars = await VillageRegistra.findAll({
        where: { villageId: req.params.villageId },
      });
      res.json(registrars);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Create a new registrar for a village
router.post(
  "/:villageId/registrars",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra"]),
  async (req, res) => {
    try {
      const village = await Village.findByPk(req.params.villageId);
      if (!village) {
        return res.status(404).json({ message: "Village not found" });
      }
      const registrar = await VillageRegistra.create({
        ...req.body,
        villageId: req.params.villageId,
      });
      res.status(201).json(registrar);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a village registrar
router.put(
  "/:villageId/registrars/:registrarId",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra"]),
  async (req, res) => {
    try {
      const registrar = await VillageRegistra.findOne({
        where: { id: req.params.registrarId, villageId: req.params.villageId },
      });
      if (registrar) {
        await registrar.update(req.body);
        res.json(registrar);
      } else {
        res.status(404).json({ message: "Registrar not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a village registrar
router.delete(
  "/:villageId/registrars/:registrarId",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra"]),
  async (req, res) => {
    try {
      const registrar = await VillageRegistra.findOne({
        where: { id: req.params.registrarId, villageId: req.params.villageId },
      });
      if (registrar) {
        await registrar.destroy();
        res.json({ message: "Registrar deleted" });
      } else {
        res.status(404).json({ message: "Registrar not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ... existing code ...

module.exports = router;
