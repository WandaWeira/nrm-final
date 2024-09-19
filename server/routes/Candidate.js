const express = require('express');
const router = express.Router();
const { Candidate, Election, User } = require('../models');

// Create a new candidate
router.post('/', async (req, res) => {
    try {
        const { electionId, ...candidateData } = req.body;
        const election = await Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }
        const candidate = await Candidate.create({ ...candidateData, electionId });
        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new candidate for a specific election type
router.post('/election/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;
        const candidateData = req.body;

        const election = await Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        const candidate = await Candidate.create({
            ...candidateData,
            electionId
        });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all candidates for a specific election type
router.get('/election/:electionId', async (req, res) => {
    try {
        const candidates = await Candidate.findAll({ where: { electionId: req.params.electionId } });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a candidate by ID
router.get('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ error: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a candidate
router.put('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            await candidate.update(req.body);
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ error: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a candidate
router.delete('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            await candidate.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Nominate a candidate
router.post('/:id/nominate', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            candidate.nominatedBy = req.body.nominatedBy;
            await candidate.save();
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ error: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update votes for a candidate
router.post('/:id/vote', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            candidate.votes += req.body.votes;
            await candidate.save();
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ error: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Check if a candidate is the winner in a specific election type
router.get('/:id/is-winner', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const electionId = candidate.electionId;
        const candidates = await Candidate.findAll({ where: { electionId } });
        const maxVotes = Math.max(...candidates.map(c => c.votes));

        if (candidate.votes === maxVotes) {
            res.status(200).json({ isWinner: true });
        } else {
            res.status(200).json({ isWinner: false });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
