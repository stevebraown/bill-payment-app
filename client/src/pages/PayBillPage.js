import { useMemo, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';
import Card from '../components/Card';
import InlineAlert from '../components/InlineAlert';
import PaymentPanel from '../components/PaymentPanel';
import Spinner from '../components/Spinner';
import { formatCurrency, formatDate } from '../utils/format';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const PayBillPage = () => {
  const [billNumber, setBillNumber] = useState('');
  const [bill, setBill] = useState(null);
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const canLookup = billNumber.trim().length > 0;

  const handleLookup = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const response = await api.get(`/bills/${billNumber.trim()}`);
      setBill(response.data);
    } catch (error) {
      setBill(null);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Bill not found. Check the bill number and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentSummary = useMemo(() => {
    if (!bill) return null;
    return {
      status: bill.status || 'unpaid',
      amountOwed: bill.amountOwed || 0,
      dueDate: bill.dueDate ? formatDate(bill.dueDate) : 'Not set',
    };
  }, [bill]);

  return (
    <div className="page-grid">
      <div className="page-column">
        <Card title="Bill Lookup">
          <p className="muted">
            Enter the bill number to retrieve the latest balance and payment status.
          </p>
          <div className="form-row">
            <label className="form-label" htmlFor="billNumber">
              Bill number
            </label>
            <input
              id="billNumber"
              type="text"
              className="form-input"
              placeholder="e.g. BILL-1001"
              value={billNumber}
              onChange={event => setBillNumber(event.target.value)}
            />
          </div>
          <button className="button primary" onClick={handleLookup} disabled={!canLookup || loading}>
            {loading ? 'Looking up...' : 'Lookup bill'}
          </button>
          {loading && (
            <div className="inline-loader">
              <Spinner size="sm" />
              <span>Fetching bill details</span>
            </div>
          )}
          {message && <InlineAlert type={message.type} text={message.text} />}
        </Card>

        {bill && (
          <Card title="Bill Summary">
            <div className="summary-grid">
              <div>
                <div className="label">Bill number</div>
                <div className="value">{bill.billNumber}</div>
              </div>
              <div>
                <div className="label">Customer</div>
                <div className="value">{bill.registeredName}</div>
              </div>
              <div>
                <div className="label">Service</div>
                <div className="value">{bill.type}</div>
              </div>
              <div>
                <div className="label">Due date</div>
                <div className="value">{paymentSummary?.dueDate}</div>
              </div>
              <div>
                <div className="label">Amount due</div>
                <div className="value">{formatCurrency(paymentSummary?.amountOwed)}</div>
              </div>
              <div>
                <div className="label">Status</div>
                <span className={`status-pill ${paymentSummary?.status}`}>{paymentSummary?.status}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="page-column">
        <Card title="Payment">
          <p className="muted">
            Pay securely using Stripe test mode. Use card number <strong>4242 4242 4242 4242</strong> and any
            future expiry date.
          </p>
          {!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && (
            <InlineAlert
              type="error"
              text="Stripe publishable key is missing. Add REACT_APP_STRIPE_PUBLISHABLE_KEY to enable payments."
            />
          )}
          {!bill && <InlineAlert type="info" text="Look up a bill to enable payments." />}
          {bill && (
            <Elements stripe={stripePromise}>
              <PaymentPanel
                bill={bill}
                agentId={agentId}
                onAgentChange={setAgentId}
                onPaymentSuccess={updatedBill => {
                  setBill(updatedBill);
                  setMessage({
                    type: 'success',
                    text: 'Payment confirmed and bill updated.',
                  });
                }}
              />
            </Elements>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PayBillPage;
