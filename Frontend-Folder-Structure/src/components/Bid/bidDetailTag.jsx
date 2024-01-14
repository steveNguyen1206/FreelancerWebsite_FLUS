import React, { useState, useRef, useEffect } from 'react';
import './bidDetailTag.css';
import flag from '../../assets/vietnam.png';
import { StarRating } from '@/components';
import bidServices from '@/services/bidServices';
import gmailService from '@/services/gmailServices';

const convertStartDate = (date1) => {
  let date = new Date(date1);
  let formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
};

const calEndDate = (startDate, duration) => {
  let date = new Date(startDate);
  let endDate = new Date(date.getTime() + duration * 86400000);
  let formattedDate = endDate.toISOString().split('T')[0];
  return formattedDate;
};

const BidDetailTag = ({ project, bid, onChangeBid, isOwnerProjectPost ,onChangeProjectId}) => {
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

  let projectId = 0;

  const handleAccept = () => {
    bidServices
      .acceptBid(bid.id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        console.log('response: ', response);
        onChangeProjectId(response.data.projectId);
        projectId = response.data.projectId;
      });

    onChangeBid();
    const emailData = {
      email: bid.email,
      url: 'http://localhost:8081/project-manage/' + projectId,
    };
    gmailService.sendEmail(emailData).then((response) => {
      console.log('response: ', response);
    });
  };

  const handleReject = () => {
    bidServices
      .rejectBid(bid.id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
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
              marginLeft: '1%',
            }}
          >
            <div className="group row">
              <div
                className="col-3"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <img
                  className="rectangle"
                  alt="Rectangle"
                  src={bid.user.avt_url}
                />
              </div>
              <div className="name-container col">
                <div className="first-line-container">
                  <div className="text-wrapper-5">{bid.user.account_name}</div>
                  <span className="text-wrapper-6">
                    ({bid.user.profile_name})
                  </span>
                  <div className="flag-container">
                    <img className="rectangle-2" alt="Rectangle" src={flag} />
                  </div>
                </div>
                

                <div className="group-2">
                  <StarRating rating={bid.user.avg_rating} width={140} />
                  <div className="rating-number">{bid.user.avg_rating}</div>
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
                  {bid.message}
                </span>
                <div className="row" style={{ marginTop: '12px' }}>
                  <div className="col date-offer">Start Date: </div>
                  <div className="col date-text">
                    {convertStartDate(project.start_date)}{' '}
                  </div>
                  <div className="col date-offer">End Date: </div>
                  <div className="col date-text">
                    {calEndDate(project.start_date, bid.duration)}
                  </div>
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
            <div className="budget-wrapper">{bid.price + '$'}</div>

            {isOwnerProjectPost && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDetailTag;
