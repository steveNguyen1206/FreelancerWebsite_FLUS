import React from 'react';
import './update_avatar.css';
import { useState } from 'react';
import { UpdateAvatarForm } from '@/components';

const UpdateAvartar = ({ user_id, avt_url }) => {

  return (
    <div> 
      <div className="update-avatar-section">
        <div className="update-avatar-container">
          <img className="update-ellipse" src={avt_url} />
        </div>

        <UpdateAvatarForm userId={user_id} />

        <div className='update-avatar-text'>
          Select a photo to change profile picture
        </div>
      </div>  
    </div>
  );
};

export default UpdateAvartar;
