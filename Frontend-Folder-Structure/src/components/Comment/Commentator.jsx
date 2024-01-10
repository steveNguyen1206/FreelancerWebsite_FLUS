import './CommentProject.css';
import vietnam from '../../assets/vietnam.png';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import userDataService from '../../services/userDataServices';
import reviewService from '@/services/reviewServices';

const Commentator = ({ user_id, comment }) => {
  // get User info from id
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [user_id]);

  const fetchUser = async () => {
    try {
      const userData = await userDataService.findOnebyId(user_id);
      setUser(userData.data);
      console.log('user data: ', userData.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // get rating of user
  const [rating, setRating] = useState([]);

  useEffect(() => {
    fetchRating();
  }, [user_id]);

  const fetchRating = async () => {
    try {
      const ratingData = await reviewService.getRatingFreelancer(user_id);
      setRating(ratingData.data);
      console.log('rating data: ', ratingData.data);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  return (
    <>
      <div className="commentator">
        <div className="commentator-info">
          <div className="commentator-image">
            <img src={user.avt_url} alt="profile" />
          </div>
          <div className="commentator-name">
            <p>{account_name}</p>
            <img src={vietnam} alt="vietnam" />
          </div>
        </div>
        <div className="comment-star">
          <StarRating
            rating={rating.average_rating === null ? 0 : rating.average_rating}
          />
          <p>{rating.average_rating}</p>
          <div className="comment-time">
            <p>2 days ago</p>
          </div>
        </div>
        <div className="comment-content">
          <p>{comment}</p>
        </div>
      </div>
      
    </>
  );
};

export default Commentator;
