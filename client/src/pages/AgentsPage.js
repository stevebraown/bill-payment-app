import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import InlineAlert from '../components/InlineAlert';
import Spinner from '../components/Spinner';
import { formatCurrency, formatDate } from '../utils/format';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agentsResponse, paymentsResponse] = await Promise.all([
          api.get('/agents'),
          api.get('/payments/recent'),
        ]);
        setAgents(agentsResponse.data);
        setPayments(paymentsResponse.data);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Unable to load agent data right now.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-grid">
      <div className="page-column">
        <Card title="Active Agents">
          {loading && (
            <div className="inline-loader">
              <Spinner size="sm" />
              <span>Loading agents</span>
            </div>
          )}
          {message && <InlineAlert type={message.type} text={message.text} />}
          {!loading && !agents.length && <InlineAlert type="info" text="No agents found." />}
          {!!agents.length && (
            <div className="list">
              {agents.map(agent => (
                <div className="list-row" key={agent._id}>
                  <div>
                    <div className="value">{agent.name}</div>
                    <div className="muted">{agent.phone}</div>
                  </div>
                  <div className="pill">{formatCurrency(agent.commission || 0)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="page-column">
        <Card title="Recent Payments">
          {loading && (
            <div className="inline-loader">
              <Spinner size="sm" />
              <span>Loading payments</span>
            </div>
          )}
          {!loading && !payments.length && <InlineAlert type="info" text="No recent payments yet." />}
          {!!payments.length && (
            <div className="table">
              <div className="table-row header">
                <div>Bill</div>
                <div>Agent</div>
                <div>Amount</div>
                <div>Date</div>
              </div>
              {payments.map(payment => (
                <div className="table-row" key={payment._id}>
                  <div>{payment.bill?.billNumber || '—'}</div>
                  <div>{payment.agent?.name || '—'}</div>
                  <div>{formatCurrency(payment.amount)}</div>
                  <div>{formatDate(payment.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AgentsPage;
