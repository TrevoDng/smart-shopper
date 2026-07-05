// src/account/payments/YocoPayment.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useIdempotency } from '../../hooks/useIdempotency';
import { api } from '../../services/api.service';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface YocoPaymentProps {
  amount: number;
  email: string;
  customerName?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const YocoPayment: React.FC<YocoPaymentProps> = ({
  amount,
  email,
  customerName,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ id: string } | null>(null);
  const cardFrameRef = useRef<HTMLDivElement>(null);
  const { idempotencyKey, generateNewKey } = useIdempotency();

  // Load Yoco SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.yoco.com/ypay/web/v1/ypay.js';
    script.async = true;
    script.onload = () => setIsSDKReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isSDKReady) {
      onError?.('Payment system is still loading. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create payment intent on backend
      const response = await api.yocoCreatePayment({
        amount: amount, //Math.round(amount * 100), // Convert to cents!
        currency: 'ZAR',
        metadata: {
        email,
        customerName,
        },
        idempotencyKey,
      });

      // 2. Initialize Yoco SDK
      const yoco = new window.YocoSDK({
        publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY,
      });

      // 3. Show popup
      yoco.showPopup({
        amountInCents: Math.round(amount * 100),
        currency: 'ZAR',
        paymentId: (response as any).paymentId,
        onResult: (result: any) => {
          if (result.error) {
            onError?.(result.error.message);
            setIsProcessing(false);
            generateNewKey();
          } else if (result.status === 'succeeded') {
            // Payment successful
            onSuccess?.((response as any).orderId);
          }
        },
      });
    } catch (error: any) {
      onError?.(error.message);
      setIsProcessing(false);
      generateNewKey();
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-xl font-semibold">Yoco</h3>
      <p className="mb-4 text-gray-600">
        Pay securely with your credit or debit card.
      </p>
      
      <button
        onClick={handlePayment}
        disabled={isProcessing || !isSDKReady}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
      >
        {!isSDKReady
          ? 'Loading...'
          : isProcessing
          ? 'Processing...'
          : `Pay R${amount.toFixed(2)} with Yoco`}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>✅ Secure card payments</p>
        <p>✅ Visa, Mastercard, AMEX accepted</p>
        <p>✅ Apple Pay & Google Pay supported</p>
        <p>💳 Fee: 2.95%</p>
      </div>

      {paymentResult && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Payment successful! ID: {paymentResult.id}
        </div>
      )}
    </div>
  );
};

export default YocoPayment;