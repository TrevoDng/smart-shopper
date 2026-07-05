// src/account/payments/PaymentStatus.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface PaymentStatusProps {
  onRetry?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ onRetry }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'cancel' | 'error' | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters
    const transactionStatus = searchParams.get('TransactionStatus');
    const reference = searchParams.get('reference');
    
    if (reference) {
      setReference(reference);
    }

    if (transactionStatus === 'Complete' || searchParams.get('success')) {
      setStatus('success');
    } else if (transactionStatus === 'Cancelled' || searchParams.get('cancel')) {
      setStatus('cancel');
    } else if (searchParams.get('error')) {
      setStatus('error');
    }
  }, [searchParams]);

  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4 text-6xl text-green-500">✅</div>
            <h2 className="mb-2 text-2xl font-bold text-green-600">
              Payment Successful!
            </h2>
            <p className="mb-4 text-gray-600">
              Your payment has been processed successfully.
            </p>
            {reference && (
              <p className="mb-4 text-sm text-gray-500">
                Order Reference: {reference}
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {status === 'cancel' && (
          <div className="text-center">
            <div className="mb-4 text-6xl text-yellow-500">⏸️</div>
            <h2 className="mb-2 text-2xl font-bold text-yellow-600">
              Payment Cancelled
            </h2>
            <p className="mb-4 text-gray-600">
              You cancelled the payment. No charges were made.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onRetry}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4 text-6xl text-red-500">❌</div>
            <h2 className="mb-2 text-2xl font-bold text-red-600">
              Payment Failed
            </h2>
            <p className="mb-4 text-gray-600">
              Something went wrong. Please try again or contact support.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onRetry}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;