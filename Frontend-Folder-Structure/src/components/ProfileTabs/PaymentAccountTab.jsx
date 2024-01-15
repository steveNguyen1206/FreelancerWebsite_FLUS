import React from 'react';
import './PaymentAccountTab.css';
import { useState, useEffect } from 'react';
import paymentServices from '@/services/paymentServices';

const PaymentAccountTab = ({ userId }) => {
  const [sended, setSended] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState(''); 

  useEffect(() => {
    setSended(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      account_address: paymentAccount,
    };
    console.log(payload);
    try {
      const response = await paymentServices.createPaymentAccount(
        payload,
        localStorage.getItem('AUTH_TOKEN')
      );
      setSended(true);
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  return (
    <>
      {sended ? (
        <div className="form-container">
            <h3 style={{ marginBottom: '36px' }}>Payment account created</h3>
        </div>
      ) : (
        <form className="form-container">
          <div className="">
            <h3 style={{ marginBottom: '36px' }}>Payment account</h3>
            <input
              type="text"
              className="my-text-input my-input"
              placeholder="paypal@payment.com"
              style={{ marginBottom: '36px' }}
              onChange={(e) => setPaymentAccount(e.target.value)}
            />
            <button
              className="my-button --button-green "
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default PaymentAccountTab;
