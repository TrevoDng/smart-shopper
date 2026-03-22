// CheckoutPage.tsx
import { relative } from 'path';
import React, { useState } from 'react';
import { useCartlist } from '../context/CartlistContext';
import { cleanPrice } from '../../utils/filterUtils';
import { useSlider } from '../../../../slider/slidercontext/SliderContext';
import { useNavigate } from 'react-router-dom';

// ---------- TypeScript interfaces ----------
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ---------- Payment Methods Component ----------
const PaymentMethods: React.FC = () => {
  const methods = [
    'VISA', 'EDGARS', '0000 0000 0000 0000', 'Pay', 'Pay', 'Pay',
    'RCS', 'PayJustNow.', 'Xpayflex', 'mobicred', 'Happy Pay',
    'BANK', 'pay by', 'zapper'
  ];

  return (
    <div className="payment-section">
      <h2 className="payment-heading">WE ACCEPT:</h2>
      <div className="payment-grid">
        {methods.map((method, idx) => (
          <div key={idx} className="payment-item">
            {method}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Checkout Form Component ----------
const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const { cartlist } = useCartlist();
  const {hideSlider} = useSlider();
       
       //hide slider
           hideSlider();
    const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order placed with data:', formData);
    alert('Order placed! (check console)');
  };

  const returnToCart=()=> {
    navigate('/cart');
  }


  const shipping = 65.00;
  const tax = 164.10;
 

  const overrallTotal = cartlist.items.reduce((sum, item)=> sum + cleanPrice(item.product.price), 0) + shipping + tax;

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        {/* Left side: form */}
        <div className="form-section">
          <h1 className="form-title">Complete your details</h1>
          <p className="form-sub">We need a few details to process your order.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Address line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Address line 2 <span className="optional">(optional)</span></label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">City / Town</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Province / State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Postal code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="" disabled>-- Select --</option>
                  <option value="ZA">South Africa</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="AU">Australia</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="place-order-button">
              Place order · R {overrallTotal.toFixed(2)}
            </button>
            <a href="#" className="back-link" 
                onClick={returnToCart}>← Return to cart</a>
          </form>
        </div>

        {/* Right side: order summary */}
        <div className="order-summary">
          <h3 className="summary-title">🛒 Your order</h3>
          {cartlist.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <span>{item.product.title}</span>
              <span>R {cleanPrice(item.product.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-item">
            <span>Shipping (standard)</span>
            <span>R {shipping.toFixed(2)}</span>
          </div>
          <div className="order-item">
            <span>Tax (15% VAT)</span>
            <span>R {tax.toFixed(2)}</span>
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>R {overrallTotal.toFixed(2)}</span>
          </div>
          <p className="secure-note" 
          style={{position:"relative"}}>
            <i className='fa-regular fa-circle-check' 
          style={{
            position:"absolute",
            color:"rgb(0, 199, 43)", 
            fontSize:"20px", 
            top:"17px"}}></i> 
            <span style={{position:"absolute", left:"25px"}}>100% secure checkout · Your data is protected</span>
            </p>
        </div>
      </div>
    </div>
  );
};

// ---------- Combined Page Component with Responsive Styles ----------
const CheckoutPage: React.FC = () => {
  return (
    <>
      <style>{`
        /* Global / responsive styles */
        .checkout-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          background: #f3f6f9;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .payment-section {
          background: #f9fafc;
          border-radius: 2rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .payment-heading {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          border-left: 6px solid #3b82f6;
          padding-left: 1rem;
        }
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }
        .payment-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 500;
          color: #0f172a;
          font-size: 0.95rem;
          min-height: 70px;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .payment-item:hover {
          transform: translateY(-3px);
          border-color: #b1c5e0;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          background: #ffffff;
        }

        .checkout-container {
          background: white;
          border-radius: 2rem;
          box-shadow: 0 20px 40px -10px rgba(0,20,50,0.15);
          overflow: hidden;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          gap: 2rem;
          padding: 2.5rem;
        }
        .form-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #0a2540;
          margin-bottom: 0.25rem;
        }
        .form-sub {
          color: #5b6877;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          border-bottom: 1px solid #e9edf2;
          padding-bottom: 1rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }
        .label {
          display: block;
          font-weight: 500;
          font-size: 0.9rem;
          color: #1e2b3c;
          margin-bottom: 0.3rem;
        }
        .input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid #dfe5ec;
          border-radius: 1rem;
          font-size: 1rem;
          transition: border 0.15s, box-shadow 0.15s;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: #2266cc;
          box-shadow: 0 0 0 3px rgba(34,102,204,0.1);
        }
        .optional {
          font-size: 0.85rem;
          color: #7b8a9b;
          font-weight: 400;
        }
        .place-order-button {
          background: #0a2540;
          color: white;
          border: none;
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 3rem;
          margin-top: 1.5rem;
          cursor: pointer;
          box-shadow: 0 8px 16px -5px rgba(10,37,64,0.2);
          transition: background 0.2s, transform 0.1s;
        }
        .place-order-button:hover {
          background: #1f3a5f;
        }
        .place-order-button:active {
          transform: scale(0.98);
        }

        .order-summary {
          background: #f8fafd;
          border-radius: 1.5rem;
          padding: 1.8rem;
          align-self: start;
          border: 1px solid #e6edf4;
        }
        .summary-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #0f2b3d;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .order-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: #2f3f51;
          font-size: 0.95rem;
        }
        .order-total {
          display: flex;
          justify-content: space-between;
          border-top: 2px dashed #cbd5e1;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          color: #0a1e2f;
        }
        .secure-note {
          font-size: 0.85rem;
          color: #657b93;
          margin-top: 1rem;
          border-top: 1px solid #dde5ed;
          padding-top: 1rem;
        }
        .back-link {
            display: inline-block;
            margin-top: 1.5rem;
            color: #436688;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }

        /* Responsive styles */
        @media (max-width: 750px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1.5rem;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .payment-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .payment-heading {
            font-size: 1.6rem;
          }
          .checkout-page {
            padding: 1rem;
          }
        }
        @media (max-width: 480px) {
          .payment-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .payment-item {
            font-size: 0.85rem;
            padding: 0.75rem 0.25rem;
          }
        }
      `}</style>
      <div className="checkout-page">
        <CheckoutForm />
        <PaymentMethods />
      </div>
    </>
  );
};

export default CheckoutPage;