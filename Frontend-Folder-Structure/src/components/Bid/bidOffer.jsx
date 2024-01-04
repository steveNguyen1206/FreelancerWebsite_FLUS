import { useState } from 'react';
import './bid.css';
import profileImage from '../../assets/profile_image.png';
import contactService from '@/services/contactServices';
//name, skill, message, price, duration, accept, reject

const BidOffer = ({ bidOne }) => {
  const skill = 'React, NodeJS';

  const handleAccept = () => {
    console.log('accept');
  };

  const handleReject = () => {
    console.log('reject');
    console.log('bidOne.id: ', bidOne.id);
    contactService.changeContactStatus(bidOne.id, -1).then((response) => {
      console.log('response: ', response);
      // onChangeBid();
    });
  };

  return (
    <div className="bid">
      <div className="bid-header">
        <div className="image-profile">
          {/* <img src={profileImage} alt="profile" /> */}
          <img src={bidOne.user.avt_url} alt="profile" />
        </div>
        <div className="bid-username">
          {/* <h5>{uname}</h5> */}
          <h5>{bidOne.user.profile_name}</h5>
          <p style={{ color: 'green' }}>{skill}</p>
        </div>
        <div style={{outerHeight: '8px'}}>
            <div className="bid-rating">
            <p>4.5</p>
            </div>
        </div>

      </div>
      <div className="bid-body-detail">
        <div className="bid-price">
          <p>{bidOne.budget}$</p>
        </div>
      </div>

      <div className="bid-button">
        <button className="reject" onClick={handleReject}>
          Reject
        </button>
        <button className="accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default BidOffer;