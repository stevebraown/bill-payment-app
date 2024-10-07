const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Make sure you have a Payment model set up

// Simulate payment initiation
router.post('/initiate', async (req, res) => {
  const { userId, amount } = req.body;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

  try {
    const payment = new Payment({ user: userId, amount, status: 'pending' });
    await payment.save();

    const isSuccess = Math.random() < 0.9; // 90% chance of success

    if (isSuccess) {
      payment.status = 'completed';
      await payment.save();
      return res.status(201).json({ message: 'Payment completed successfully (simulated)', payment });
    } else {
      payment.status = 'failed';
      await payment.save();
      return res.status(500).json({ message: 'Payment failed (simulated)', payment });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error initiating payment', err });
  }
});

module.exports = router;
