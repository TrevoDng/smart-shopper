// src/account/payments/PaymentMethodSelector.tsx
import React, { useState, useEffect } from 'react';
import styles from './PaymentMethodSelector.module.css';
import PayFastPayment from './PayFastPayment';
import YocoPayment from './YocoPayment';
import OzowPayment from './OzowPayment';

export type PaymentMethod = 'payfast' | 'yoco' | 'ozow';

interface PaymentMethodSelectorProps {
  onSelect?: (method: PaymentMethod) => void;
  isOpen?: boolean;
  onClose?: () => void;
  // New props for payment flow
  amount?: number;
  email?: string;
  customerName?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  isOpen = false,
  onClose,
  amount,
  email = 'guest@example.com',
  customerName = 'Guest',
  onSuccess,
  onError,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => setIsVisible(false), 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onSelect?.(method);
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  const handleSuccess = (orderId: string) => {
    onSuccess?.(orderId);
    onClose?.();
  };

  const handleClose = () => {
    if (selectedMethod) {
      // eslint-disable-next-line no-restricted-globals
      if (!confirm('Are you sure you want to cancel this payment?')) return;
    }
    setSelectedMethod(null);
    onClose?.();
  };

  const getCardClass = (methodId: string) => {
    const baseClass = styles.card;
    const methodClass = 
      methodId === 'payfast' ? styles.payfast :
      methodId === 'yoco' ? styles.yoco :
      styles.ozow;
    return `${baseClass} ${methodClass}`;
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Close Button */}
        <button onClick={handleClose} className={styles.closeButton}>
          ✕
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {selectedMethod ? 'Complete Payment' : 'Select Payment Method'}
          </h2>
          <p className={styles.subtitle}>
            {selectedMethod 
              ? `Pay securely with ${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}`
              : 'Choose your preferred payment method'
            }
          </p>
        </div>

        {!selectedMethod ? (
          <>
            {/* Payment Methods Grid */}
            <div className={styles.grid}>
              {/* PayFast */}
              <button
                onClick={() => handleMethodClick('payfast')}
                className={getCardClass('payfast')}
              >
                <span className={styles.cardBadge}>Popular</span>
                <div className={styles.cardIcon}>💳</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>PayFast</h3>
                  <p className={styles.cardDescription}>
                    Credit card, instant EFT, SnapScan, and more.
                  </p>
                  <div className={styles.cardTags}>
                    <span className={styles.cardTag}>Cards</span>
                    <span className={styles.cardTag}>EFT</span>
                    <span className={styles.cardTag}>SnapScan</span>
                  </div>
                  <p className={styles.cardFee}>Fee: 3.5% + R2.00</p>
                </div>
              </button>

              {/* Yoco */}
              <button
                onClick={() => handleMethodClick('yoco')}
                className={getCardClass('yoco')}
              >
                <span className={styles.cardBadge}>Best Rates</span>
                <div className={styles.cardIcon}>💳</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>Yoco</h3>
                  <p className={styles.cardDescription}>
                    Lowest card rates in SA. Apple Pay & Google Pay supported.
                  </p>
                  <div className={styles.cardTags}>
                    <span className={styles.cardTag}>Visa</span>
                    <span className={styles.cardTag}>Mastercard</span>
                    <span className={styles.cardTag}>Apple Pay</span>
                  </div>
                  <p className={styles.cardFee}>Fee: 2.95%</p>
                </div>
              </button>

              {/* Ozow */}
              <button
                onClick={() => handleMethodClick('ozow')}
                className={getCardClass('ozow')}
              >
                <span className={styles.cardBadge}>Lowest Fee</span>
                <div className={styles.cardIcon}>🏦</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>Ozow</h3>
                  <p className={styles.cardDescription}>
                    Instant EFT – pay directly from your bank account.
                  </p>
                  <div className={styles.cardTags}>
                    <span className={styles.cardTag}>FNB</span>
                    <span className={styles.cardTag}>ABSA</span>
                    <span className={styles.cardTag}>Capitec</span>
                  </div>
                  <p className={styles.cardFee}>Fee: ~1.5% – 2.5%</p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <p className={styles.footerText}>
                🔒 All payments are securely processed. Your financial information is safe.
              </p>
              <div className={styles.footerIcons}>
                <span className={styles.footerIcon}>🔒</span>
                <span className={styles.footerIcon}>💳</span>
                <span className={styles.footerIcon}>🏦</span>
              </div>
            </div>
          </>
        ) : (
          // Selected Payment Method View
          <div>
            {/* Back Button */}
            <button onClick={handleBack} className={styles.backButton}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to payment methods
            </button>

            {/* Order Summary */}
            {amount !== undefined && (
              <div className={styles.orderSummary}>
                <div className={styles.orderSummaryRow}>
                  <span className={styles.orderSummaryLabel}>Total Amount</span>
                  <span className={styles.orderSummaryAmount}>R{amount.toFixed(2)}</span>
                </div>
                <div className={styles.orderSummaryDetails}>
                  <span>Customer: {customerName}</span>
                  <span>{email}</span>
                </div>
              </div>
            )}

            {/* Selected Payment Component */}
            {selectedMethod === 'payfast' && (
              <PayFastPayment
                amount={amount || 0}
                email={email}
                customerName={customerName}
                onSuccess={handleSuccess}
                onError={onError}
              />
            )}

            {selectedMethod === 'yoco' && (
              <YocoPayment
                amount={amount || 0}
                email={email}
                customerName={customerName}
                onSuccess={handleSuccess}
                onError={onError}
              />
            )}

            {selectedMethod === 'ozow' && (
              <OzowPayment
                amount={amount || 0}
                email={email}
                customerName={customerName}
                onSuccess={handleSuccess}
                onError={onError}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;