import { useState } from 'react';
import './bid.css';
import profileImage from '../../assets/profile_image.png';
//name, skill, message, price, duration, accept, reject

const Bid = ({}) => {
  const uname = 'Nguyen Thi Truc';
  const userName = 'cogai20';
  const price = '100$';
  const skill = 'React, NodeJS';
  const message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit iyrey ifhiu ewuyriu odfiuh o.';
  const duration = '5 days';

  const accept = () => {
    console.log('accept');
  };

  const reject = () => {
    console.log('reject');
  };

  return (
    <div className="bid">
      <div className="bid-header">
        <div className="image-profile">
          <img src={profileImage} alt="profile" />
        </div>
        <div className="bid-username">
          <h5>{uname}</h5>
          <p style={{ color: 'green' }}>{skill}</p>
        </div>
        <div className="bid-rating">
          <p>4.5</p>
        </div>
      </div>
      <div className="bid-body-detail">
        <div className="bid-message">
          <p>{message}</p>
        </div>
        <div className="bid-price">
          <p>{price}</p>
        </div>
      </div>

      <div className="bid-button">
        <button className="reject" onClick={reject}>
          Reject
        </button>
        <button className="accept" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default Bid;
