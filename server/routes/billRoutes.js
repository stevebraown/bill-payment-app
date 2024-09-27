// /server/routes/billRoutes.js
const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get bill by number
router.get('/:billNumber', async (req, res) => {
  try {
    const bill = await Bill.findOne({ billNumber: req.params.billNumber });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new bill (for initial setup)
router.post('/', async (req, res) => {
  const { billNumber, registeredName, amountOwed, type } = req.body;
  const bill = new Bill({ billNumber, registeredName, amountOwed, type });

  try {
    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
