import razorpay
from config import settings
from typing import Dict, Any

class PaymentService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))

    def create_order(self, amount: int, currency: str = "INR") -> Dict[str, Any]:
        """
        Creates a Razorpay order.
        Amount should be in the smallest currency unit (e.g., paise for INR).
        """
        data = {
            "amount": amount,
            "currency": currency,
            "payment_capture": 1  # Auto-capture payment
        }
        return self.client.order.create(data=data)

    def verify_payment(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """
        Verifies the signature of a successful payment.
        """
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        try:
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception as e:
            print(f"Payment verification failed: {e}")
            return False

    def verify_webhook_signature(self, body: str, signature: str) -> bool:
        """
        Verifies the signature of a Razorpay webhook.
        """
        try:
            self.client.utility.verify_webhook_signature(body, signature, settings.razorpay_webhook_secret)
            return True
        except Exception as e:
            print(f"Webhook verification failed: {e}")
            return False

payment_service = PaymentService()
