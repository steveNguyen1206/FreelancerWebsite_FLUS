import React, { useState, useEffect } from 'react';
import './FreelancerPost.css';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import { StarRating } from '..';
import eyeLight from '../../assets/eyeLight.png';
import { useNavigate } from 'react-router';
import reviewService from '@/services/reviewServices';

const FreelancerPost = ({ post }) => {
  const navigate = useNavigate();

  const handleClickPost = (postId) => {
    console.log('post: ', postId);
    navigate(`/findFreelancer/${postId}`);
  };

  const [review, setReview] = useState('');

  useEffect(() => {
    reviewService
      .getRatingFreelancer(post.user.id)
      .then((res) => {
        setReview(res.data);
        console.log('review: ', res.data);
      })
      .catch((err) => {
        console.log(err);
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
              {/* Hello everyone, my name is Duy Khang Ho. This job is hard... Detail
            text here everyone text here everyone Hello everyone, my name is Duy
            Khang Ho. This job is hard... Detail text here ever... Detail text
            here everyone text here everyone Hello everyone, my name is Duy Khang
            Ho.Hello everyone, my name is Duy Khang Ho. This job is hard... Detail
            text here everyone text here everyone Hello everyone, my name is Duy
            Khang Ho. This job is hard... Detail text here ever... Detail text
            here everyone text here everyone Hello everyone, my name is Duy Khang
            Ho. */}
              {post.skill_description}
            </div>
          </div>
        </div>
      </div>

      <div className="right-post">
        <div className="previews">
          <div className="rating-row">
            <StarRating rating={review.averageStar} width={160} className="pstars" />
            <div style={{}}>{review.averageStar}</div>
          </div>
          <div className="num-reviews-wrapper">{review.count + " reviews"}</div>
        </div>
        <div className="pbid">
          <div className="pprice">From ${post.lowset_price}</div>
          <div className="btn-row">
            <div className="btn-bid">
              <button>Hire me</button>
            </div>
            <img src={eyeLight} onClick={() => handleClickPost(post.id)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPost;
