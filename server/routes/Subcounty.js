const express = require("express");
const router = express.Router();
const { Subcounty, Parish,SubcountyRegistra  } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all subcounties
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subcounties = await Subcounty.findAll();
    res.json(subcounties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific subcounty
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const subcounty = await Subcounty.findByPk(req.params.id);
    if (subcounty) {
      res.json(subcounty);
    } else {
      res.status(404).json({ message: "Subcounty not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subcounty
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const subcounty = await Subcounty.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(subcounty);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a subcounty
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const subcounty = await Subcounty.findByPk(req.params.id);
      if (subcounty) {
        if (req.user.role !== "SuperAdmin" && subcounty.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved subcounty" });
        }
        await subcounty.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(subcounty);
      } else {
        res.status(404).json({ message: "Subcounty not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a subcounty
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const subcounty = await Subcounty.findByPk(req.params.id);
      if (subcounty) {
        if (req.user.role !== "SuperAdmin" && subcounty.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved subcounty" });
        }
        await subcounty.destroy();
        res.json({ message: "Subcounty deleted" });
      } else {
        res.status(404).json({ message: "Subcounty not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a subcounty (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const subcounty = await Subcounty.findByPk(req.params.id);
      if (subcounty) {
        await subcounty.update({ status: "approved", approvedBy: req.user.id });
        res.json(subcounty);
      } else {
        res.status(404).json({ message: "Subcounty not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all parishes in a subcounty
router.get("/:subcountyId/parishes", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const parishes = await Parish.findAll({ where: { subcountyId: req.params.subcountyId } });
    res.json(parishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a parish in a subcounty
router.post("/:subcountyId/parishes", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const parish = await Parish.create({ ...req.body, subcountyId: req.params.subcountyId });
    res.status(201).json(parish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all registrars for a subcounty
router.get("/:subcountyId/registrars", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const registrars = await SubcountyRegistra.findAll({
      where: { subcountyId: req.params.subcountyId }
    });
    res.json(registrars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new registrar for a subcounty
router.post("/:subcountyId/registrars", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const subcounty = await Subcounty.findByPk(req.params.subcountyId);
    if (!subcounty) {
      return res.status(404).json({ message: "Subcounty not found" });
    }
    const registrar = await SubcountyRegistra.create({
      ...req.body,
      subcountyId: req.params.subcountyId
    });
    res.status(201).json(registrar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a subcounty registrar
router.put("/:subcountyId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await SubcountyRegistra.findOne({
      where: { id: req.params.registrarId, subcountyId: req.params.subcountyId }
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

// Delete a subcounty registrar
router.delete("/:subcountyId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await SubcountyRegistra.findOne({
      where: { id: req.params.registrarId, subcountyId: req.params.subcountyId }
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
