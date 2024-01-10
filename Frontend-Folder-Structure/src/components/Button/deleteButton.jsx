import React from 'react';
import './deleteButton.css';

const DeleteButton = ({onClick}) => {
  return <div className="delete-button" onClick={onClick}> X </div>;
};

export default DeleteButton;
