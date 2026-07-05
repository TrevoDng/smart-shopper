// src/account/payments/getPaymentMethod.tsx
import PaymentMethodSelector from './PaymentMethodSelector';

export const getPaymentMethodSelector = (
  isOpen: boolean = false,
  onClose?: () => void,
  onSelect?: (method: string) => void
) => {
  const handleSelect = (method: string) => {
    console.log("Selected payment method:", method);
    onSelect?.(method);
  };

  return (
    <PaymentMethodSelector
      onSelect={handleSelect}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

// For direct use with full payment flow
export const getFullPaymentSelector = (
  isOpen: boolean,
  amount: number,
  email: string,
  customerName: string,
  onSuccess: (orderId: string) => void,
  onError: (error: string) => void,
  onClose: () => void
) => {
  return (
    <PaymentMethodSelector
      isOpen={isOpen}
      amount={amount}
      email={email}
      customerName={customerName}
      onSuccess={onSuccess}
      onError={onError}
      onClose={onClose}
    />
  );
};