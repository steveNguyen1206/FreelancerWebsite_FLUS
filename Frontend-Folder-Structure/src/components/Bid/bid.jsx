import { useState } from 'react';
import './bid.css';
import bidServices from '@/services/bidServices';

const Bid = ({
  bidId,
  username,
  price,
  skill,
  profileImage,
  rating,
  onChangeBid,
}) => {
  const handleAccept = () => {
    console.log('accept');
    bidServices.changeBidStatus(bidId, 1).then((response) => {
      console.log('response: ', response);
      // onChangeBid();
    });
  };

  const handleReject = () => {
    console.log('reject');
    // change status of bid to rejected
    bidServices.changeBidStatus(bidId, -1).then((response) => {
      console.log('response: ', response);
      onChangeBid();
    });
  };

  return (
    <div className="bid-cont">
      <div className="bid-header">
        <div className="image-profile">
          <img src={profileImage} alt="profile" />
        </div>
        <div className="bid-username">
          <h5>{username}</h5>
          <p style={{ color: 'green' }}>{skill}</p>
        </div>
        <div className="bid-rating">
          <p>{rating}</p>
        </div>
      </div>
      <div className="bid-body-detail">
        <div className="bid-price">
          <p>{price + '$'}</p>
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

export default Bid;