const express = require("express");
const router = express.Router();
const {
  Candidate,
  NationalCandidate,
  VillageCellCandidate,
  ParishesWardsCandidate,
  SubcountiesDivisionsCandidate,
  ConstituencyMunicipalityCandidate,
  DistrictCandidate,
  NationalOppositionCandidate
} = require("../models");
const { authMiddleware, checkPermission } = require("../middleware/middleware");

// Helper function to create CRUD routes for a model
const createCRUDRoutes = (model, path) => {
  // Create
  router.post(
    `/${path}`,
    authMiddleware,
    checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
    async (req, res) => {
      try {
        const { ninNumber, firstName, lastName, phoneNumber, ...nationalData } =
          req.body;

        // First, create or find the Candidate
        const [candidate, created] = await Candidate.findOrCreate({
          where: { ninNumber },
          defaults: {
            firstName,
            lastName,
            phoneNumber,
            electionType: "national",
          },
        });

        // Then, create the NationalCandidate
        const item = await model.create({
          ...nationalData,
          candidateId: candidate.id,
          status: req.user.role === "SuperAdmin" ? "approved" : "pending",
          createdBy: req.user.id,
        });

        res.status(201).json({
          ...item.toJSON(),
          firstName,
          lastName,
          phoneNumber,
          ninNumber,
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Read all
  router.get(
    `/${path}`,
    authMiddleware,
    checkPermission("PEO"),
    async (req, res) => {
      try {
        const items = await model.findAll({
          include: [
            {
              model: Candidate,
              attributes: ["firstName", "lastName", "phoneNumber", "ninNumber"],
            },
          ],
        });
        res.json(
          items.map((item) => ({
            ...item.toJSON(),
            firstName: item.Candidate?.firstName || "",
            lastName: item.Candidate?.lastName || "",
            phoneNumber: item.Candidate?.phoneNumber || "",
            ninNumber: item.Candidate?.ninNumber || "",
          }))
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Read one
  router.get(
    `/${path}/:id`,
    authMiddleware,
    checkPermission("PEO"),
    async (req, res) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (item) {
          res.json(item);
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Update
  router.put(
    `/${path}/:id`,
    authMiddleware,
    checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
    async (req, res) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (item) {
          if (req.user.role !== "SuperAdmin" && item.status === "approved") {
            return res
              .status(403)
              .json({ message: "Cannot modify an approved item" });
          }
          await item.update({
            ...req.body,
            status: req.user.role === "SuperAdmin" ? "approved" : "pending",
            updatedBy: req.user.id,
          });
          res.json(item);
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Delete
  router.delete(
    `/${path}/:id`,
    authMiddleware,
    checkPermission(["SuperAdmin", "DistrictRegistra", "RegionalCoordinator"]),
    async (req, res) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (item) {
          if (req.user.role !== "SuperAdmin" && item.status === "approved") {
            return res
              .status(403)
              .json({ message: "Cannot delete an approved item" });
          }
          await item.destroy();
          res.status(204).send();
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Approve an item (SuperAdmin only)
  router.put(
    `/${path}/:id/approve`,
    authMiddleware,
    checkPermission("SuperAdmin"),
    async (req, res) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (item) {
          await item.update({ status: "approved", approvedBy: req.user.id });
          res.json(item);
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Qualify a candidate (SuperAdmin only)
  router.put(
    `/${path}/:id/qualify`,
    authMiddleware,
    checkPermission("SuperAdmin"),
    async (req, res) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (item) {
          await item.update({
            isQualified: req.body.isQualified,
            qualifiedBy: req.user.id,
            qualifiedAt: new Date(),
          });
          res.json(item);
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Get all nominated candidates
  router.get(
    `/${path}/nominated`,
    authMiddleware,
    checkPermission("PEO"),
    async (req, res) => {
      try {
        const items = await model.findAll({
          where: { status: "approved" },
          include: [
            {
              model: Candidate,
              attributes: ["firstName", "lastName", "phoneNumber", "ninNumber"],
            },
          ],
        });
        res.json(
          items.map((item) => ({
            ...item.toJSON(),
            firstName: item.Candidate?.firstName || "",
            lastName: item.Candidate?.lastName || "",
            phoneNumber: item.Candidate?.phoneNumber || "",
            ninNumber: item.Candidate?.ninNumber || "",
          }))
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
};

// Create CRUD routes for each model
createCRUDRoutes(Candidate, "candidates");
createCRUDRoutes(VillageCellCandidate, "village-cell-candidates");
createCRUDRoutes(NationalCandidate, "national");
createCRUDRoutes(ParishesWardsCandidate, "parishes-wards-candidates");
createCRUDRoutes(
  SubcountiesDivisionsCandidate,
  "subcounties-divisions-candidates"
);
createCRUDRoutes(
  ConstituencyMunicipalityCandidate,
  "constituency-municipality-candidates"
);

createCRUDRoutes(DistrictCandidate, "district-candidates");

createCRUDRoutes(NationalOppositionCandidate, "national-opposition-candidates");

module.exports = router;
