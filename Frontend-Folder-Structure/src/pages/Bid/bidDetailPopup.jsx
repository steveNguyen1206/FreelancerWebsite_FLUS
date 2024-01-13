import React from 'react';
import './bidDetailPopup.css';
import { Bid, StarRating } from '@/components';
import { useEffect, useState } from 'react';
import BidDetailTag from '@/components/Bid/bidDetailTag';

const BidDetailPopup = ({
  setPopUpAppear,
  onChange,
  bidProject,
  projectPost,
  isOwnerProjectPost,
  onChangeProjectId
}) => {
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
              project={projectPost}
              bid={bid}
              onChangeBid={() => setIsChange(!isChange)}
              isOwnerProjectPost={isOwnerProjectPost}
              onChangeProjectId={onChangeProjectId}
              
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BidDetailPopup;
