import React from 'react';
import './Post.css';
import vietnam from '../../assets/vietnam.png';
import heart from '../../assets/heart-active.png';
import unactiveHeart from '../../assets/heart-unactive.png';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import projectPostWishlistServices from '../../services/projectPostWishlistServices';

const Post = ({ project, handleBidClick }) => {
  const [isLiked, setIsLiked] = useState('');

  useEffect(() => {
    projectPostWishlistServices
      .isExisted(project.id,  localStorage.getItem('AUTH_TOKEN'))
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
            <div className="post-name">{project.user.account_name}</div>
            <div className="post-username">({project.user.profile_name})</div>
            <div className="post-location">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>

          <div className="post-title">{project.title}</div>

          <div className="post-tags">
            <div className="post-tag">
              {project.subcategory.subcategory_name}
            </div>
          </div>
        </div>
        <div className="post-detail">{project.detail}</div>
      </div>

      <div className="right-post">
        <div className="post-reviews">
          <div className="post-rating">
            <p>{project.user.avg_rating}</p>
            <StarRating
              rating={parseFloat(project.user.avg_rating)}
              width={100}
              className="pstars"
            />
          </div>
        </div>
        <div className="post-bid">
          <div className="post-price">
            {`$${project.budget_min} - $${project.budget_max}`}
          </div>
          <div className="btn-bid-container">
            <div className="btn-bid-project">
              <button onClick={handleBidClick}>Bid</button>
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
