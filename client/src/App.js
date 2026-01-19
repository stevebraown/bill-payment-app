import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import PayBillPage from './pages/PayBillPage';
import AgentsPage from './pages/AgentsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <div className="app-logo">BP</div>
            <div>
              <div className="app-title">BillPay Prototype</div>
              <div className="app-subtitle">Utility bill payments</div>
            </div>
          </div>
          <nav className="app-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Pay Bill
            </NavLink>
            <NavLink to="/agents" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Agents
            </NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PayBillPage />} />
            <Route path="/agents" element={<AgentsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
