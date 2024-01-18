import React, { useState, useEffect } from 'react';
import './HorizonFreelancerPostCell.css';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import eyeLight from '../../assets/eyeLight.png';
import { useNavigate } from 'react-router';

const HorizonFreelancerPostCell = ({post}) => {
  const navigate = useNavigate();
  
  const handleClickPost = (postId) => {
    console.log('post: ', postId);
    navigate(`/findFreelancer/${postId}`)
  }

  return (
  <div className="post-cell-container">
    <div className="pheader">
    <div className="pprofile">
        <img className='avatar' src={post.user.avt_url} alt="profile" />
        <div className="pname">{post.user.profile_name} </div>
        <div className="plocation">
        <img src={vietnam} alt="vietnam" />
        </div>
    </div>
    
    </div>
    <div className='content-container'>
    <div className="ptitle">{post.title}</div>
    <div className="post-cell-tag">{post.subcategory.subcategory_name}</div>
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
    
    <div className="pbid">
        <div className="pprice">From ${post.lowset_price}</div>
        <div className="btn-row">
            <div className="btn-bid">
            <button onClick={() => handleClickPost(post.id)}>View</button>
            </div>
            {/* <img  src={eyeLight} onClick={() => handleClickPost(post.id)}/> */}

        </div>
    </div>

  </div>
)
  }

export default HorizonFreelancerPostCell;
