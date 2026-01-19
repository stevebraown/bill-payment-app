import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import api from '../services/api';
import InlineAlert from './InlineAlert';
import Spinner from './Spinner';
import { formatCurrency } from '../utils/format';

const PaymentPanel = ({ bill, agentId, onAgentChange, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setMessage(null);

    try {
      const intentResponse = await api.post('/payments/create-intent', {
        billNumber: bill.billNumber,
        agentId: agentId || undefined,
      });

      const { clientSecret } = intentResponse.data;
      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error.message || 'Payment failed.' });
        setProcessing(false);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        const confirmResponse = await api.post('/payments/confirm', {
          billNumber: bill.billNumber,
          paymentIntentId: result.paymentIntent.id,
          agentId: agentId || undefined,
        });

        onPaymentSuccess(confirmResponse.data.bill);
        setMessage({
          type: 'success',
          text: `Payment confirmed. Reference ${result.paymentIntent.id}.`,
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Payment failed. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-panel">
      <div className="form-row">
        <label className="form-label" htmlFor="amountDue">
          Amount due
        </label>
        <input
          id="amountDue"
          className="form-input"
          value={formatCurrency(bill.amountOwed)}
          readOnly
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="agentId">
          Agent ID (optional)
        </label>
        <input
          id="agentId"
          className="form-input"
          placeholder="Paste agent ID"
          value={agentId}
          onChange={event => onAgentChange(event.target.value)}
        />
      </div>
      <div className="form-row">
        <label className="form-label">Card details</label>
        <div className="card-element">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      <button className="button primary" onClick={handlePay} disabled={processing || !stripe}>
        {processing ? (
          <span className="button-inline">
            <Spinner size="sm" />
            Processing...
          </span>
        ) : (
          'Pay securely'
        )}
      </button>
      {message && <InlineAlert type={message.type} text={message.text} />}
    </div>
  );
};

export default PaymentPanel;
