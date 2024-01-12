import React from 'react';
import './UpdateButton.css';

const UpdateButton = ({ button_name, onClick }) => {
  return (
    <div className='update-button' onClick={onClick}>
      {button_name}
    </div>
  );
};

export default UpdateButton;
