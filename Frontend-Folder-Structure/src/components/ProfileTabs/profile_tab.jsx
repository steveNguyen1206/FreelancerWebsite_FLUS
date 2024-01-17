import React from 'react';
import './profile_tab.css';
import { SmallProj } from '@/components';
import projectPostWishlistServices from '@/services/projectPostWishlistServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import WishlistPost from '../DisplayCard/wishlist';
import paymentServices from '@/services/paymentServices';

const EmptyTab = () => {
  return (
    <div className="tab">
      <SmallProj />
      <SmallProj />
      <SmallProj />
      <SmallProj />
      <SmallProj />
    </div>
  );
};

const BankTab = (userId) => {
  const [sended, setSended] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState('');

  useEffect(() => {
    setSended(false);
    paymentServices.getPaymentAccount(localStorage.getItem('AUTH_TOKEN')).then((res) => {
      if (res.status == 200) {
        setPaymentAccount(res.data.account_address);
      }
      console.log(res.data.account_address)
    });
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
  };

  return (
    <>
      {sended ? (
        <div className="form-container">
          <h3 style={{ marginBottom: '36px' }}>Payment account created</h3>
        </div>
      ) : (
        <div className="bank-tab">
          {/* <div className="scroll-bar">
                <div className="rectangle-3" />
              </div> */}
          <div className="link-to-bank-text-wrap">Link to Payment Account</div>
          <div className="paypal-mail-wrapper">
            <input
              className="paypal-mail"
              placeholder="Input your paypal email here to add your paypal account"
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
            />
            <button text={'Add Paypal'} className="add-paypal-btn" onClick={handleSubmit}>
              Update Paypal Account
            </button>
          </div>
          {/* <div className='available-payment-header'>
                Your available paypal email(s):
              </div> */}
        </div>
      )}
    </>
  );
};

const WishlistTab = ({ userID }) => {
  console.log('user id: ', userID);
  // get wishlist by user id
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    projectPostWishlistServices
      .getWishlistByUserId(localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        console.log('response: ', response.data);
        setWishlist(response.data);
      });
  }, [userID]);

  return (
    <div className="wishlist-outline">
      <div className="wishlist-tab">
        {wishlist.map((item) => (
          <WishlistPost
            key={item.id}
            projectId={item.id}
            projectTitle={item.title}
            projectTagsId={item.tag_id}
            projectDetail={item.detail}
            projectBudget={[item.budget_min, item.budget_max]}
            userID={item.user_id}
            handleToProjectPostClick={() => {
              console.log('navigate to project detail page');
              navigate(`/project/${item.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { EmptyTab, BankTab, WishlistTab };
