import React, { useState, useRef, useEffect } from 'react';
import './bidDetailTag.css';
import flag from '../../assets/vietnam.png';
import avatar from '../../assets/avatar_green.png';
import { StarRating } from '@/components';
import bidServices from '@/services/bidServices';
import gmailService from '@/services/gmailServices';
import projectPostServices from '@/services/projectPostServices';


const BidDetailTag = ({
  bidId,
  accout_name,
  profileImage,
  username,
  message,
  startDate,
  endDate,
  avgRating,
  price,
  email,
  projectId,
  onChangeBid,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const textContainer = textContainerRef.current;
    if (textContainer.scrollHeight > textContainer.clientHeight) {
      setShowSeeMore(true);
    } else {
      setShowSeeMore(false);
    }
  }, []);

  const handleSeeMoreClick = () => {
    setExpanded(!expanded);
  };

  const textContainerStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: expanded ? 'unset' : 5,
    WebkitBoxOrient: 'vertical',
  };

  const handleAccept = () => {
    console.log('accept');
    bidServices.changeBidStatus(bidId, 1, localStorage.getItem('AUTH_TOKEN')).then((response) => {
      console.log('response: ', response);
      // send email to freelancer
      const emailJson = {
        email: email,
      };

      gmailService.sendEmail(emailJson).then((response) => {
        console.log('response: ', response);
      });

      // change other bids to rejected
      bidServices.changeOtherBidStatus(bidId, -1, localStorage.getItem('AUTH_TOKEN')).then((response) => {
        console.log('response: ', response);
      });

      // change project post status
      projectPostServices.changeStatus(projectId, 0, localStorage.getItem('AUTH_TOKEN')).then((response) => {
        console.log('response: ', response);
      });

      // TODO: create project
      // TODO: navigate to project detail page
      onChangeBid();
    });
  };

  const handleReject = () => {
    console.log('reject');
    // change status of bid to rejected
    bidServices.changeBidStatus(bidId, -1, localStorage.getItem('AUTH_TOKEN')).then((response) => {
      console.log('response: ', response);
      onChangeBid();
    });
  };

  return (
    <div className="bid-contain">
      <div className="overlap">
        <div
          className="row"
          style={{ height: '100%', width: '100%', alignItems: 'flex-start' }}
        >
          <div
            className="col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div className="group row">
              <div
                className="col-3"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <img className="rectangle" alt="Rectangle" src={profileImage} />
              </div>
              <div className="name-container col">
                <div className="first-line-container row">
                  <div className="text-wrapper-5">{accout_name}</div>
                  <div className="flag-container">
                    <img className="rectangle-2" alt="Rectangle" src={flag} />
                  </div>
                </div>
                <span className="text-wrapper-6">({username})</span>

                <div className="group-2">
                  <StarRating rating={avgRating} width={140} />
                  <div className="rating-number">{avgRating}</div>
                </div>
              </div>
            </div>
            <div
              className="detail-text-container"
              style={textContainerStyle}
              ref={textContainerRef}
            >
              {/* <Collapse in={expanded}> */}
              <div>
                <span className="span" id="collapseSummary">
                  {message}
                </span>
                <div className="row" style={{ marginTop: '12px' }}>
                  <div className="col date-offer">Start Date: </div>
                  <div className="col date-text">{startDate} </div>
                  <div className="col date-offer">End Date: </div>
                  <div className="col date-text">{endDate} </div>
                </div>
              </div>
              {/* </Collapse> */}
            </div>
            {showSeeMore && (
              <a
                className="text-wrapper-3"
                role="button"
                aria-expanded={expanded}
                onClick={handleSeeMoreClick}
              >
                {expanded ? 'See Less' : 'See More'}
              </a>
            )}
          </div>
          <div className="col-3">
            <div className="budget-wrapper">{price + '$'}</div>

            <div className="btns">
              <div className="overlap-group-3">
                <div className="text-wrapper-7" onClick={handleAccept}>
                  Accept
                </div>
              </div>
              <div className="overlap-2">
                <div className="text-wrapper-8" onClick={handleReject}>
                  Reject
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDetailTag;
