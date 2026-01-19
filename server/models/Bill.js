// /server/models/Bill.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  registeredName: { type: String, required: true },
  amountOwed: { type: Number, required: true },
  type: { type: String, enum: ['electricity', 'water', 'taxes', 'school fees'], required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  lastPaidAt: { type: Date },
  paymentHistory: [{
    date: { type: Date, default: Date.now },
    amountPaid: Number,
    status: String,
    reference: String,
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
  }]
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
