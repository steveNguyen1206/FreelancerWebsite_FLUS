import React from 'react';
import './profile_tab.css';
import { SmallProj } from '@/components';
import projectPostWishlistServices from '@/services/projectPostWishlistServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import WishlistPost from '../DisplayCard/wishlist';

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

const BankTab = () => {
    return(
        <div className='bank-tab'>
            {/* <div className="scroll-bar">
                <div className="rectangle-3" />
            </div> */}
            <div className='link-to-bank-text-wrap'>
               Link to Payment Account
            </div>
            <div className='paypal-mail-wrapper'>
                <input className='paypal-mail' placeholder='Input your paypal email here to add your paypal account'/>
                <button text={"Add Paypal"} className='add-paypal-btn'>Add Paypal</button>
            </div>
            <div className='available-payment-header'>
                Your available paypal email(s):
            </div>
            
        </div>
       
    );
}

const WishlistTab = ({ userID }) => {
  console.log('user id: ', userID);
  // get wishlist by user id
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    projectPostWishlistServices.getWishlistByUserId(userID).then((response) => {
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
            userID={userID}
            handleToProjectPostClick={() => {
              console.log('navigate to project detail page');
              navigate(`/project/${item.id}`);
            }
            }
          />
        ))}
      </div>
    </div>
  );
};

export { EmptyTab, BankTab, WishlistTab };

