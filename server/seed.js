const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bill = require('./models/Bill');
const Agent = require('./models/Agent');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 50000,
  });

  await Bill.deleteMany({});
  await Agent.deleteMany({});

  const agents = await Agent.insertMany([
    { name: 'Ava Coleman', phone: '+1 555-0101', commission: 42.5 },
    { name: 'Miguel Torres', phone: '+1 555-0102', commission: 18.75 },
  ]);

  await Bill.insertMany([
    {
      billNumber: 'BILL-1001',
      registeredName: 'Jordan Lee',
      amountOwed: 128.5,
      type: 'electricity',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      billNumber: 'BILL-1002',
      registeredName: 'Priya Shah',
      amountOwed: 64.25,
      type: 'water',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      billNumber: 'BILL-1003',
      registeredName: 'Luca Romano',
      amountOwed: 300,
      type: 'school fees',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed complete:', { agents: agents.length, bills: 3 });
  await mongoose.disconnect();
};

seed().catch(err => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err);
  mongoose.disconnect();
});
