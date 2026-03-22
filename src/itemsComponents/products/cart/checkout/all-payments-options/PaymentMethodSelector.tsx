import React from 'react';
import styles from './PaymentMethodSelector.module.css';

// ... rest of your imports and types ...
// Define the payment method type
export type PaymentMethod = 'payfast' | 'yoco' | 'ozow';

// Props interface
interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;   // Callback when a method is chosen
  isOpen?: boolean;                             // For modal/popup mode
  onClose?: () => void;                         // To close the popup
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  isOpen = false,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleMethodClick = (method: PaymentMethod) => {
    onSelect(method);
  };

  const getCardClass = (methodId: string) => {
    const baseClass = styles.card;
    const methodClass = 
      methodId === 'payfast' ? styles.payfast :
      methodId === 'yoco' ? styles.yoco :
      styles.ozow;
    
    return `${baseClass} ${methodClass}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        )}

        <h2 className={styles.title}>Select Payment Method</h2>

        <div className={styles.grid}>
          <button
            onClick={() => handleMethodClick('payfast')}
            className={getCardClass('payfast')}
          >
            <div className={styles.icon}>💳</div>
            <h3 className={styles.name}>PayFast</h3>
            <p className={styles.description}>Pay by credit card, instant EFT, or other methods.</p>
            <p className={styles.fee}>Fee: 3.5% + R2.00 (cards)</p>
          </button>

          <button
            onClick={() => handleMethodClick('yoco')}
            className={getCardClass('yoco')}
          >
            <div className={styles.icon}>💳</div>
            <h3 className={styles.name}>Yoco</h3>
            <p className={styles.description}>Secure online card payments (Visa, Mastercard, AMEX).</p>
            <p className={styles.fee}>Fee: 2.95% (cards)</p>
          </button>

          <button
            onClick={() => handleMethodClick('ozow')}
            className={getCardClass('ozow')}
          >
            <div className={styles.icon}>🏦</div>
            <h3 className={styles.name}>Ozow</h3>
            <p className={styles.description}>Instant EFT – pay directly from your bank account.</p>
            <p className={styles.fee}>Fee: ~1.5% – 2.5%</p>
          </button>
        </div>

        <p className={styles.footer}>
          You will be redirected to the selected payment partner to complete your purchase securely.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;