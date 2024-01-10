import React from 'react';
import './WhiteButton.css';

const WhiteButton = ({text, onClick}) => {
  return (
    <button onClick={onClick}
    class="white-button">
      {text}
    </button>
  );
};
export default WhiteButton;
