import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [billNumber, setBillNumber] = useState('');
  const [billData, setBillData] = useState(null);

  const handleBillCheck = async () => {
    try {
      const response = await axios.get(`/api/bills/${billNumber}`);
      setBillData(response.data);
    } catch (err) {
      console.error('Error fetching bill:', err);
    }
  };

  return (
    <div>
      <h1>Check Your Bill</h1>
      <input
        type="text"
        value={billNumber}
        onChange={(e) => setBillNumber(e.target.value)}
        placeholder="Enter bill number"
      />
      <button onClick={handleBillCheck}>Check Bill</button>

      {billData && (
        <div>
          <h2>Bill Details</h2>
          <p>Name: {billData.name}</p>
          <p>Amount Owed: {billData.amount}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
