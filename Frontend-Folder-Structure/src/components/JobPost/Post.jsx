import React from 'react';
import './Post.css';
import vietnam from '../../assets/vietnam.png';
import heart from '../../assets/heart-active.png';
import unactiveHeart from '../../assets/heart-unactive.png';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import projectPostWishlistServices from '../../services/projectPostWishlistServices';
import reviewService from '@/services/reviewServices';

const Post = ({ project, handleBidClick }) => {
  console.log('project', project);
  const [isLiked, setIsLiked] = useState('');

  useEffect(() => {
    projectPostWishlistServices
      .isExisted(project.id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        if (response.data === true) {
          setIsLiked(heart);
        } else {
          setIsLiked(unactiveHeart);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [project.user.id, project.id]);


  const handleLikeClick = () => {
    if (isLiked === unactiveHeart) {
      projectPostWishlistServices
        .create(project.id, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setIsLiked(heart);
        });
    }
    if (isLiked === heart) {
      projectPostWishlistServices
        .remove(project.id, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setIsLiked(unactiveHeart);
        });
    }
  };

  const [review, setReview] = useState('');

  useEffect(() => {
    reviewService.getRating(project.user.id).then((response) => {
      console.log('response: ', response);
      setReview(response.data);
    });
  }, []
  );

  return (
    <div className="post-container">
      <div className="left-post">
        <div className="post-header">
          <div className="post-profile">
            <img
              className="img-post"
              src={project.user.avt_url}
              alt="profile"
            />
            <div className="post-name">{project.user.profile_name}</div>
            <div className="post-username">({project.user.account_name})</div>
            <div className="post-location">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>
        </div>

        <div className="project-post-container">
          <div className="post-title">{project.title}</div>
          <div className="post-tag">{project.subcategory.subcategory_name}</div>
          <div className="post-detail">{project.detail}</div>
        </div>
      </div>

      <div className="right-post">
        <div className="post-reviews">
          <div className="post-rating">
            <StarRating
              rating={review.average}
              width={120}
              className="pstars"
            />
            <p>{review.average}</p>
          </div>
        </div>
        <div className="post-bid">
          <div className="post-price">
            {`$${project.budget_min} - $${project.budget_max}`}
          </div>
          <div className="btn-bid-container">
            <div className="btn-bid-project">
              <button onClick={handleBidClick}>View</button>
            </div>
            <div className="post-wish">
              <button onClick={handleLikeClick}>
                <img src={isLiked} alt="heart icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
