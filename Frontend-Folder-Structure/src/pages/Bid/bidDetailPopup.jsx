import React from 'react';
import './bidDetailPopup.css';
import { Bid, StarRating } from '@/components';
import { useEffect, useState } from 'react';
import BidDetailTag from '@/components/Bid/bidDetailTag';

const BidDetailPopup = ({ setPopUpAppear, project_post_id, onChange, bidProject}) => {
  const handleExitClick = () => {
    setPopUpAppear(false);
    onChange();
  };

  const [isChange, setIsChange] = useState(false);
  const bidNum = bidProject.length;

  return (
    <div className="popup-container-background">
      <div className="popup-container-bid">
        <div className="row-wrapper">
          <div className="exit-container" onClick={handleExitClick}>
            <div className="text-wrapper">x</div>
          </div>
        </div>

        <div className="div-wrapper">
          <div className="text-wrapper-title">Applications</div>
        </div>
        <div className="avg">
          <div className="text-wrapper-2">{bidNum + ' Bids'}</div>
        </div>

        <div className="bid-container">
          {bidProject.map((bid) => (
            <BidDetailTag
              key={bid.id}
              bidId={bid.id}
              accout_name={bid.user.account_name}
              profileImage={bid.user.avt_url}
              username={bid.user.profile_name}
              message={bid.message}
              startDate={new Date(bid.createdAt).toISOString().split('T')[0]}
              endDate={
                new Date(
                  new Date(bid.createdAt).getTime() + bid.duration * 86400000
                )
                  .toISOString()
                  .split('T')[0]
              }
              avgRating={bid.user.averageStar}
              price={bid.price}
              onChangeBid={() => setIsChange(!isChange)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BidDetailPopup;
