const express = require("express");
const router = express.Router();
const { Constituency, Subcounty, ConstituencyRegistra } = require("../models");
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


// Changes 20/09/2024   -   STARTS  --------------------------------------------
// Get all registrars for a constituency
router.get("/:constituencyId/registrars", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const registrars = await ConstituencyRegistra.findAll({ where: { constituencyId: req.params.constituencyId } });
    res.json(registrars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new registrar for a constituency
router.post("/:constituencyId/registrars", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await ConstituencyRegistra.create({
      ...req.body,
      constituencyId: req.params.constituencyId,
    });
    res.status(201).json(registrar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a constituency registrar
router.put("/:constituencyId/registrars/:id", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await ConstituencyRegistra.findOne({
      where: { id: req.params.id, constituencyId: req.params.constituencyId },
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

// Delete a constituency registrar
router.delete("/:constituencyId/registrars/:id", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await ConstituencyRegistra.findOne({
      where: { id: req.params.id, constituencyId: req.params.constituencyId },
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

// Changes 20/09/2024   -   END  --------------------------------------------

module.exports = router;
