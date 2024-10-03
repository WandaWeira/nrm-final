const express = require("express");
const router = express.Router();
const { Division, Municipality,DivisionRegistra  } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all divisions
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const divisions = await Division.findAll();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific division
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const division = await Division.findByPk(req.params.id);
    if (division) {
      res.json(division);
    } else {
      res.status(404).json({ message: "Division not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new division
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const division = await Division.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(division);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a division
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const division = await Division.findByPk(req.params.id);
      if (division) {
        if (req.user.role !== "SuperAdmin" && division.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved division" });
        }
        await division.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(division);
      } else {
        res.status(404).json({ message: "Division not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a division
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const division = await Division.findByPk(req.params.id);
      if (division) {
        if (req.user.role !== "SuperAdmin" && division.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved division" });
        }
        await division.destroy();
        res.json({ message: "Division deleted" });
      } else {
        res.status(404).json({ message: "Division not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a division (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const division = await Division.findByPk(req.params.id);
      if (division) {
        await division.update({ status: "approved", approvedBy: req.user.id });
        res.json(division);
      } else {
        res.status(404).json({ message: "Division not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all municipalities in a division
router.get("/:divisionId/municipalities", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const municipalities = await Municipality.findAll({ where: { divisionId: req.params.divisionId } });
    res.json(municipalities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a municipality in a division
router.post("/:divisionId/municipalities", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const municipality = await Municipality.create({ ...req.body, divisionId: req.params.divisionId });
    res.status(201).json(municipality);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all registrars for a division
router.get("/:divisionId/registrars", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const registrars = await DivisionRegistra.findAll({
      where: { divisionId: req.params.divisionId }
    });
    res.json(registrars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new registrar for a division
router.post("/:divisionId/registrars", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const division = await Division.findByPk(req.params.divisionId);
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }
    const registrar = await DivisionRegistra.create({
      ...req.body,
      divisionId: req.params.divisionId
    });
    res.status(201).json(registrar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a division registrar
router.put("/:divisionId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await DivisionRegistra.findOne({
      where: { id: req.params.registrarId, divisionId: req.params.divisionId }
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
});

// Delete a division registrar
router.delete("/:divisionId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await DivisionRegistra.findOne({
      where: { id: req.params.registrarId, divisionId: req.params.divisionId }
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
});

module.exports = router;