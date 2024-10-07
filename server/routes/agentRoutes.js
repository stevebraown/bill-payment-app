const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// Create a new agent
router.post('/create', async (req, res) => {
  const { name, phone } = req.body;
  try {
    const agent = new Agent({ name, phone });
    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating agent', err });
  }
});

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agents', err });
  }
});

// Update agent commission
router.put('/update-commission/:id', async (req, res) => {
  const { id } = req.params;
  const { commission } = req.body;
  try {
    const agent = await Agent.findById(id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    agent.commission = commission;
    await agent.save();
    res.status(200).json({ message: 'Agent commission updated', agent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating commission', err });
  }
});

module.exports = router;
