# Frontend Skill 07: Payment Screen (Razorpay)

## Architecture
The payment screen (`app/payment.tsx`) restricts Free users and pushes them to upgrade to PRO. We use Razorpay for processing.

## UI Layout
1. **Header**: "Unlock Your Potential" or similar aggressive copy.
2. **Comparison Table / List**:
   - Free: 10 grammar checks, basic topics. (Strikethrough or muted).
   - Pro: Unlimited grammar checks, Coach Priya, ALL topics. (Checked, bold).
3. **Price Tag**: "₹199 / month".
4. **Subscribe Button**: Primary Blue, wide button "Upgrade to Pro".

## Razorpay Integration (React Native)
Use the `react-native-razorpay` library.
1. User taps "Upgrade".
2. Frontend calls `POST /api/payments/create-order` on our backend.
3. Receives `order_id` and basic settings.
4. Opens Razorpay Checkout:
   ```javascript
   import RazorpayCheckout from 'react-native-razorpay';
   
   var options = {
     description: 'SpokenEnglishAPP Pro',
     currency: 'INR',
     key: 'YOUR_RAZORPAY_KEY',
     amount: '19900',
     name: 'SpokenEnglishAPP',
     order_id: response.data.order_id,
     theme: {color: '#2B59FF'}
   }
   
   RazorpayCheckout.open(options).then((data) => {
     // Payment success! The backend webhook will upgrade the user.
     // Show success modal and refresh user context.
   }).catch((error) => {
     // Handle failure
   });
   ```
