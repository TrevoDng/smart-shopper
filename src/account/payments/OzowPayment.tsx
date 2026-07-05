// src/account/payments/OzowPayment.tsx
import React, { useState } from 'react';
import { useIdempotency } from '../../hooks/useIdempotency';
import { api } from '../../services/api.service';

interface OzowPaymentProps {
  amount: number;
  email: string;
  customerName?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const OzowPayment: React.FC<OzowPaymentProps> = ({
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
      const response = await api.ozowInitiate({
        amount: amount.toFixed(2),
        customerEmail: email,
        customerName: customerName || email,
        idempotencyKey,
      });

      // 2. Create and submit form to Ozow
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = (response as any).ozowUrl;
      form.target = '_self';

      Object.entries((response as any).ozowParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      // User is redirected away
    } catch (error: any) {
      onError?.(error.message);
      setIsProcessing(false);
      generateNewKey();
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-xl font-semibold">Ozow</h3>
      <p className="mb-4 text-gray-600">
        Pay directly from your bank account via Instant EFT.
      </p>
      
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)} with Ozow`}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>✅ Instant EFT – pay from any bank</p>
        <p>✅ No card details required</p>
        <p>✅ Secure bank-to-bank transfer</p>
        <p>💳 Fee: ~1.5% – 2.5%</p>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
        <p className="font-medium">Supported banks:</p>
        <p>FNB, Standard Bank, ABSA, Capitec, Nedbank, Investec, African Bank</p>
      </div>
    </div>
  );
};

export default OzowPayment;