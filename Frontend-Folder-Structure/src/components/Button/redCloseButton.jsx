import React from 'react';
import './redCloseButton.css';

const RedCloseButton = ({onClick}) => {
  return <button className="red-close-button" onClick={onClick}> X </button>;
};

export default RedCloseButton;
