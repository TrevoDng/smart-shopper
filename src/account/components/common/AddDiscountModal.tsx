// src/account/components/Admin/AddDiscountModal.tsx
import React, { useState } from 'react';
import { discountApi } from '../../../services/discountApi';
import './AddDiscountModal.css';

interface AddDiscountModalProps {
  productId: string;
  productTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  productId,
  productTitle,
  onClose,
  onSuccess,
}) => {
  const [discountAmount, setDiscountAmount] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await discountApi.createDiscount({
        productId,
        discountAmount,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create discount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Discount</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product</label>
            <input type="text" value={productTitle} disabled className="disabled-input" />
          </div>
          
          <div className="form-group">
            <label>Discount Percentage (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseInt(e.target.value))}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>End Date & Time</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscountModal;