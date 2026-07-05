// src/account/payments/PayFastPayment.tsx
import React, { useState } from 'react';
import { useIdempotency } from '../../hooks/useIdempotency';
import { api } from '../../services/api.service';

interface PayFastPaymentProps {
  amount: number;
  email: string;
  customerName?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const PayFastPayment: React.FC<PayFastPaymentProps> = ({
  amount,
  email,
  customerName,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { idempotencyKey, generateNewKey } = useIdempotency();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Initiate payment on backend
      const response = await api.payfastInitiate({
        amount: amount.toFixed(2),
        itemName: 'Order Payment',
        email,
        firstName: customerName?.split(' ')[0] || '',
        lastName: customerName?.split(' ').slice(1).join(' ') || '',
        idempotencyKey,
      });

      // 2. Create and submit form to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = (response as any).payfastUrl;
      form.target = '_self';

      Object.entries((response as any).payfastFields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      // Note: User is redirected away, so onSuccess won't fire here
      // Success is handled by the return URL
      
    } catch (error: any) {
      onError?.(error.message);
      setIsProcessing(false);
      generateNewKey(); // Generate new key for retry
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-xl font-semibold">PayFast</h3>
      <p className="mb-4 text-gray-600">
        You will be redirected to PayFast to complete your payment securely.
      </p>
      
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)} with PayFast`}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>✅ Secure payment processing</p>
        <p>✅ Multiple payment methods (cards, EFT, SnapScan)</p>
        <p>💳 Fee: 3.5% + R2.00</p>
      </div>
    </div>
  );
};

export default PayFastPayment;