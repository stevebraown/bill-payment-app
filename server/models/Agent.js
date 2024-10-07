// /server/models/Agent.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Agent', agentSchema);
