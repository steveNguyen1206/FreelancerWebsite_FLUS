import React from 'react';
import './UpdateButton.css';
import { useState } from 'react';

const UpdateButton = ({ button_name, onClick }) => {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className='update-button' onClick={onClick}>
      {button_name}
    </div>
  );
};

export default UpdateButton;
