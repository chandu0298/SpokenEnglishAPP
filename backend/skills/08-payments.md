# Backend Skill 08: Payments (Razorpay)

## Architecture
Razorpay handles the conversion of FREE users to PRO users (₹199/month). 

## Plan Differences
- **FREE**: 10 grammar checks a day, Access to Beginner modules only.
- **PRO**: Unlimited grammar checks, Coach Priya access, All modules.

## API Endpoints

1. **`POST /api/payments/create-order`**
   Called by the client when they hit "Upgrade".
   - Uses Razorpay Python SDK to create an order: `razorpay_client.order.create({ "amount": 19900, "currency": "INR" })`
   - Returns the `order_id` to the frontend so it can open the Razorpay Checkout modal.

2. **`POST /api/payments/webhook`**
   Razorpay will hit this endpoint asynchronously when a payment succeeds.
   - MUST verify the `x-razorpay-signature` header using `razorpay_client.utility.verify_webhook_signature`.
   - Extracts the user_id (usually passed in `notes` during order creation).
   - Updates the user record in PostgreSQL to `plan_type = 'PRO'`.

## Webhook Security Restrictions
Do NOT protect `/api/payments/webhook` with the `get_current_user` middleware, as the request comes from Razorpay's servers, not a logged-in user. Security is handled entirely by signature verification.
