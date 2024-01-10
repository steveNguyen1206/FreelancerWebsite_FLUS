import React from 'react';
import './bidDetailPopup.css';
import { Bid, StarRating } from '@/components';
import { useEffect, useState } from 'react';
import bidServices from '@/services/bidServices';
import BidDetailTag from '@/components/Bid/bidDetailTag';
import userDataService from '@/services/userDataServices';
import reviewServices from '@/services/reviewServices';

const BidDetailPopup = ({ setPopUpAppear, project_post_id, onChange}) => {
  const handleExitClick = () => {
    setPopUpAppear(false);
    onChange();
  };

  const [bidProject, setBidProject] = useState([]);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    fetchBidProject();
  }, [isChange]);

  const fetchBidProject = async () => {
    try {
      const bidProjectData = await bidServices.findBidByProjectId(
        project_post_id
      );
      const bidProjectWithUser = await Promise.all(
        bidProjectData.data.map(async (bid) => {
          const userBidData = await userDataService.findOnebyId(bid.user_id);
          const userBidRatingData = await reviewServices.getRatingFreelancer(
            bid.user_id
          );
          return {
            ...bid,
            user: {
              ...userBidData.data,
              averageStar: userBidRatingData.data.averageStar,
            },
          };
        })
      );
      setBidProject(bidProjectWithUser);
      console.log('bid project: ', bidProjectWithUser);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
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
