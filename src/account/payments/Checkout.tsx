// src/account/payments/Checkout.tsx
import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentStatus from './PaymentStatus';

const Checkout: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setShowPayment(false);
    setShowStatus(true);
    // You could also store orderId in context/state
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const handleRetry = () => {
    setShowStatus(false);
    setShowPayment(true);
    setPaymentError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Checkout</h1>

        {!showPayment && !showStatus && (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {/* Your existing checkout form */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Order Summary
                </label>
                <div className="rounded-lg border p-4">
                  <p>Product: Premium Package</p>
                  <p className="text-xl font-bold">Total: R199.99</p>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {showPayment && (
          <PaymentMethodSelector
            amount={199.99}
            email="customer@example.com"
            customerName="John Doe"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        {showStatus && (
          <PaymentStatus onRetry={handleRetry} />
        )}

        {paymentError && !showPayment && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
            Error: {paymentError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;