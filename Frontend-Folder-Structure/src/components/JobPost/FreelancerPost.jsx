import React, { useState, useEffect } from 'react';
import './FreelancerPost.css';
import vietnam from '../../assets/vietnam.png';
import { StarRating } from '..';
import eyeLight from '../../assets/eyeLight.png';
import { useNavigate } from 'react-router';
import reviewService from '@/services/reviewServices';

const FreelancerPost = ({ post }) => {
  console.log('post: ', post);
  const navigate = useNavigate();

  const handleClickPost = (postId) => {
    console.log('post: ', postId);
    navigate(`/findFreelancer/${postId}`);
  };

  const [review, setReview] = useState('');

  useEffect(() => {
    reviewService.getRating(post.user.id).then((response) => {
      // console.log('response: ', response);
      setReview(response.data);
    });
  }, []);

  return (
    <div className="post-container">
      <div className="left-post">
        <div className="pheader">
          <div className="pprofile">
            <img src={post.user.avt_url} alt="profile" />
            <div className="pname">{post.user.profile_name} </div>
            <div className="pusername">({post.user.account_name})</div>
            <div className="plocation">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>
        </div>
        <div className="content-container">
          <div className="ptitle">{post.title}</div>
          <div className="post-tag">{post.subcategory.subcategory_name}</div>
          <div className="details">
            <div className="detail-content">
              <p style={{whiteSpace: 'pre-line'}}>{post.skill_description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="right-post">
        <div className="previews">
          <div className="rating-row">
            <StarRating
              rating={review.average}
              width={160}
              className="pstars"
            />
            <div style={{}}>{review.average}</div>
          </div>
          <div className="num-reviews-wrapper">{review.count + ' reviews'}</div>
        </div>
        <div className="pbid">
          <div className="pprice">From ${post.lowset_price}</div>
          <div className="btn-row">
            <div className="btn-bid" onClick={() => handleClickPost(post.id)} >
              <button>View</button>
            </div>
            {/* <img src={eyeLight} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPost;
