import { React, useState, useEffect } from 'react';
import './CommentProjectPost.css';
import reviewService from '@/services/reviewServices';
import userDataService from '@/services/userDataServices';
import vietnam from '../../assets/vietnam.png';
import { StarRating } from '..';

const calculateTimeDifference = (dateCreated) => {
  const now = new Date();
  const createdDate = new Date(dateCreated);
  const timeDifference = now.getTime() - createdDate.getTime();

  // Calculate the time difference in days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const Responder = ({ user, userRating, commentContent, dateCreated }) => {
  const timeDifference = calculateTimeDifference(dateCreated);
  const timeDifferenceArray = Object.values(timeDifference);
  const timeDifferenceArrayLength = timeDifferenceArray.length;
  let timeDifferenceString = '1 second ago';
  for (let i = 0; i < timeDifferenceArrayLength; i++) {
    if (timeDifferenceArray[i] !== 0) {
      timeDifferenceString = `${timeDifferenceArray[i]} ${
        i === 0
          ? timeDifferenceArray[i] === 1
            ? 'day'
            : 'days'
          : i === 1
          ? timeDifferenceArray[i] === 1
            ? 'hour'
            : 'hours'
          : i === 2
          ? timeDifferenceArray[i] === 1
            ? 'minute'
            : 'minutes'
          : i === 3
          ? timeDifferenceArray[i] === 1
            ? 'second'
            : 'seconds'
          : ''
      } ago`;
      break;
    }
  }

  return (
    <>
      <div className="responder">
        <div className="commentator-info">
          <div className="commentator-image">
            <img src={user.avt_url} alt="profile" />
          </div>
          <div className="commentator-name">
            <p>{user.account_name}</p>
            <img src={vietnam} alt="vietnam" />
          </div>

          <div className="comment-time">
            <p>{timeDifferenceString}</p>
          </div>
        </div>
        <div className="comment-star">
          <StarRating rating={userRating} />
          <p>{userRating}</p>
        </div>

        <div className="comment-content">
          <p>{commentContent}</p>
        </div>
      </div>
    </>
  );
};

export default Responder;
