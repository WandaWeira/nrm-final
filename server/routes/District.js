const express = require("express");
const router = express.Router();
const { District, Constituency, Division } = require("../models");
const { DistrictRegistra } = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Get all districts
router.get("/", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const districts = await District.findAll();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific district
router.get("/:id", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (district) {
      res.json(district);
    } else {
      res.status(404).json({ message: "District not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new district
router.post(
  "/",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const district = await District.create({
        ...req.body,
        status: req.user.role === "SuperAdmin" ? "approved" : "pending",
        createdBy: req.user.id,
      });
      res.status(201).json(district);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a district
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const district = await District.findByPk(req.params.id);
      if (district) {
        if (req.user.role !== "SuperAdmin" && district.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot modify an approved district" });
        }
        await district.update({
          ...req.body,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          updatedBy: req.user.id,
        });
        res.json(district);
      } else {
        res.status(404).json({ message: "District not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a district
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
  async (req, res) => {
    try {
      const district = await District.findByPk(req.params.id);
      if (district) {
        if (req.user.role !== "SuperAdmin" && district.status === "approved") {
          return res
            .status(403)
            .json({ message: "Cannot delete an approved district" });
        }
        await district.destroy();
        res.json({ message: "District deleted" });
      } else {
        res.status(404).json({ message: "District not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all districts that are cities
router.get("/cities", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const cityDistricts = await District.findAll({ where: { hasCity: true } });
    res.json(cityDistricts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Approve a district (SuperAdmin only)
router.put(
  "/:id/approve",
  authMiddleware,
  checkPermission("SuperAdmin"),
  async (req, res) => {
    try {
      const district = await District.findByPk(req.params.id);
      if (district) {
        await district.update({ status: "approved", approvedBy: req.user.id });
        res.json(district);
      } else {
        res.status(404).json({ message: "District not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all constituencies in a district
router.get("/:districtId/constituencies", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const constituencies = await Constituency.findAll({ where: { districtId: req.params.districtId } });
    res.json(constituencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a constituency in a district
router.post("/:districtId/constituencies", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const constituency = await Constituency.create({ ...req.body, districtId: req.params.districtId });
    res.status(201).json(constituency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all divisions in a district
router.get("/:districtId/divisions", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const divisions = await Division.findAll({ where: { districtId: req.params.districtId } });
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a division in a district
router.post("/:districtId/divisions", authMiddleware, checkPermission("SuperAdmin"), async (req, res) => {
  try {
    const division = await Division.create({ ...req.body, districtId: req.params.districtId });
    res.status(201).json(division);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Changes 20/09/2024   - STARTS  --------------------------------------------

// Get all registrars for a district
router.get("/:districtId/registrars", authMiddleware, checkPermission("PEO"), async (req, res) => {
  try {
    const registrars = await DistrictRegistra.findAll({ where: { districtId: req.params.districtId } });
    res.json(registrars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new registrar for a district
router.post("/:districtId/registrars", authMiddleware, checkPermission(["SuperAdmin", "RegionalCoordinator"]), async (req, res) => {
  try {
    const registrar = await DistrictRegistra.create({
      ...req.body,
      districtId: req.params.districtId,
      createdBy: req.user.id,
    });
    res.status(201).json(registrar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a registrar
router.put("/:districtId/registrars/:id", authMiddleware, checkPermission(["SuperAdmin", "RegionalCoordinator"]), async (req, res) => {
  try {
    const registrar = await DistrictRegistra.findOne({
      where: { id: req.params.id, districtId: req.params.districtId },
    });
    if (registrar) {
      await registrar.update({
        ...req.body,
        updatedBy: req.user.id,
      });
      res.json(registrar);
    } else {
      res.status(404).json({ message: "Registrar not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a registrar
router.delete("/:districtId/registrars/:id", authMiddleware, checkPermission(["SuperAdmin", "RegionalCoordinator"]), async (req, res) => {
  try {
    const registrar = await DistrictRegistra.findOne({
      where: { id: req.params.id, districtId: req.params.districtId },
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


// Changes 20/09/2024      - END  --------------------------------------------
module.exports = router;
