const express = require("express");
const router = express.Router();
const { Ward, Cell, WardRegistra, PollingStation } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all wards
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const wards = await Ward.findAll();
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific ward
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const ward = await Ward.findByPk(req.params.id);
    if (ward) {
      res.json(ward);
    } else {
      res.status(404).json({ message: "Ward not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new ward
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(ward);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a ward
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        if (req.user.role !== "SuperAdmin" && ward.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved ward" });
        }
        await ward.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(ward);
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a ward
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        if (req.user.role !== "SuperAdmin" && ward.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved ward" });
        }
        await ward.destroy();
        res.json({ message: "Ward deleted" });
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve a ward (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const ward = await Ward.findByPk(req.params.id);
      if (ward) {
        await ward.update({ status: "approved", approvedBy: req.user.id });
        res.json(ward);
      } else {
        res.status(404).json({ message: "Ward not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all cells in a ward
router.get(
  "/:wardId/cells",
  authMiddleware,
  checkPermission("PEO"),
  async (req, res) => {
    try {
      const cells = await Cell.findAll({
        where: { wardId: req.params.wardId },
      });
      res.json(cells);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Create a cell in a ward
router.post(
  "/:wardId/cells",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const cell = await Cell.create({
        ...req.body,
        wardId: req.params.wardId,
      });
      res.status(201).json(cell);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// ... existing code ...

// Get all registrars for a ward
router.get("/:wardId/registrars", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const registrars = await WardRegistra.findAll({
      where: { wardId: req.params.wardId }
    });
    res.json(registrars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new registrar for a ward
router.post("/:wardId/registrars", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const ward = await Ward.findByPk(req.params.wardId);
    if (!ward) {
      return res.status(404).json({ message: "Ward not found" });
    }
    const registrar = await WardRegistra.create({
      ...req.body,
      wardId: req.params.wardId
    });
    res.status(201).json(registrar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a ward registrar
router.put("/:wardId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await WardRegistra.findOne({
      where: { id: req.params.registrarId, wardId: req.params.wardId }
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

// Delete a ward registrar
router.delete("/:wardId/registrars/:registrarId", authMiddleware, checkPermission(["SuperAdmin", "DistrictRegistra"]), async (req, res) => {
  try {
    const registrar = await WardRegistra.findOne({
      where: { id: req.params.registrarId, wardId: req.params.wardId }
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

// Get all polling stations for a ward
router.get("/:wardId/polling-stations", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll({
      where: { wardId: req.params.wardId }
    });
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a polling station for a ward
router.post("/:wardId/polling-stations", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const pollingStation = await PollingStation.create({ ...req.body, wardId: req.params.wardId });
    res.status(201).json(pollingStation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a polling station in a ward
router.put("/:wardId/polling-stations/:pollingStationId", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findOne({
      where: { id: req.params.pollingStationId, wardId: req.params.wardId }
    });
    
    if (!pollingStation) {
      return res.status(404).json({ message: "Polling station not found" });
    }
    
    await pollingStation.update(req.body);
    res.json(pollingStation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a polling station in a ward
router.delete("/:wardId/polling-stations/:pollingStationId", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findOne({
      where: { id: req.params.pollingStationId, wardId: req.params.wardId }
    });
    
    if (!pollingStation) {
      return res.status(404).json({ message: "Polling station not found" });
    }
    
    await pollingStation.destroy();
    res.json({ message: "Polling station deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ... existing code ...

module.exports = router;
