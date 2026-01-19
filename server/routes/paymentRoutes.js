const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const Agent = require('../models/Agent');
const { requireFields } = require('../middleware/validate');

const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const getCommissionRate = () => {
  const parsed = Number(process.env.AGENT_COMMISSION_RATE);
  return Number.isFinite(parsed) ? parsed : 0.03;
};

const getCurrency = () => process.env.PAYMENT_CURRENCY || 'usd';

router.post('/create-intent', requireFields(['billNumber']), async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: { message: 'Stripe secret key not configured' } });
    }

    const { billNumber, agentId } = req.body;

    if (agentId && !mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: { message: 'Invalid agentId' } });
    }

    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      return res.status(404).json({ error: { message: 'Bill not found' } });
    }

    const amountInCents = Math.round(Number(bill.amountOwed) * 100);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({ error: { message: 'Invalid bill amount' } });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: getCurrency(),
      metadata: {
        billNumber,
        agentId: agentId || '',
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      bill,
      amount: bill.amountOwed,
      currency: paymentIntent.currency,
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/confirm', requireFields(['billNumber', 'paymentIntentId']), async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: { message: 'Stripe secret key not configured' } });
    }

    const { billNumber, paymentIntentId, agentId } = req.body;

    if (agentId && !mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: { message: 'Invalid agentId' } });
    }

    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      return res.status(404).json({ error: { message: 'Bill not found' } });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: { message: 'Payment not completed' } });
    }

    const amount = paymentIntent.amount / 100;
    const payment = await Payment.create({
      bill: bill._id,
      agent: agentId || undefined,
      amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      reference: paymentIntent.id,
    });

    bill.paymentHistory.push({
      amountPaid: amount,
      status: paymentIntent.status,
      reference: paymentIntent.id,
      agentId: agentId || undefined,
    });

    bill.amountOwed = Math.max(Number(bill.amountOwed) - amount, 0);
    bill.lastPaidAt = new Date();
    bill.status = bill.amountOwed === 0 ? 'paid' : 'partial';
    await bill.save();

    let commission = null;
    let agent = null;
    if (agentId) {
      agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ error: { message: 'Agent not found' } });
      }
      commission = Number((amount * getCommissionRate()).toFixed(2));
      agent.commission = Number((agent.commission + commission).toFixed(2));
      await agent.save();
    }

    return res.status(200).json({
      payment,
      bill,
      commission,
      agent,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/recent', async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('bill', 'billNumber registeredName')
      .populate('agent', 'name');

    res.status(200).json(payments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
