// /server/models/Agent.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 0.25 } // 25% commission
});

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;
