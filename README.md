# BillPay Prototype

Utility bill payment prototype built with a MERN-style stack. The MVP focuses on bill lookup, a real Stripe test-mode payment flow, and a lightweight agent commission view.

## Local Dev

1. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix client install`
2. Configure environment variables:
   - `server/.env`
     - `PORT=5000`
     - `MONGODB_URI=mongodb://localhost:27017/utilitydb`
     - `STRIPE_SECRET_KEY=sk_test_your_key`
     - `AGENT_COMMISSION_RATE=0.03`
     - `PAYMENT_CURRENCY=usd`
   - `client/.env`
     - `REACT_APP_API_BASE_URL=http://localhost:5000/api`
     - `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key`
3. Seed demo data:
   - `npm run seed`
4. Start the app:
   - `npm run dev`

## Docker Dev

1. Export env vars in your shell:
   - `export STRIPE_SECRET_KEY=sk_test_your_key`
   - `export REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key`
2. Run:
   - `docker compose up --build`

Client runs on `http://localhost:3000` and the API runs on `http://localhost:5000`.

## Test Data

Seed script creates:
- Bills: `BILL-1001`, `BILL-1002`, `BILL-1003`
- Agents: "Ava Coleman", "Miguel Torres"

## MVP Flow Walkthrough

1. Open the app and look up a bill (e.g., `BILL-1001`).
2. Review the bill summary and amount due.
3. Use Stripe test card `4242 4242 4242 4242` with any future expiry/CVC.
4. Confirm payment and see the bill status update and history.
5. Visit the Agents tab to view commission totals and recent payments.

## Notes

- Payments use Stripe PaymentIntents in test mode.
- Routes are open (no auth yet) to keep the prototype focused.
