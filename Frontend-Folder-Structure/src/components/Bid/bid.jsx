import { useState } from 'react';
import './bid.css';
import bidServices from '@/services/bidServices';
import gmailService from '@/services/gmailServices';
import projectPostServices from '@/services/projectPostServices';

const Bid = ({
  bidId,
  username,
  price,
  skill,
  profileImage,
  rating,
  email,
  projectId,
  onChangeBid,
}) => {
  const handleAccept = () => {
    console.log('accept');
    bidServices.changeBidStatus(bidId, 1).then((response) => {
      console.log('response: ', response);

      console.log(email)
      // send email to freelancer
      const emailJson = {
        email: email,
      };

      gmailService.sendEmail(emailJson).then((response) => {
        console.log('response: ', response);
      });

      // change other bids to rejected
      bidServices.changeOtherBidStatus(bidId, -1).then((response) => {
        console.log('response: ', response);
      });

      // change project post status
      projectPostServices.changeStatus(projectId, 0).then((response) => {
        console.log('response: ', response);
      });

      // TODO: create project
      // TODO: navigate to project detail page
      onChangeBid();
    });
  };

  const handleReject = () => {
    console.log('reject');
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