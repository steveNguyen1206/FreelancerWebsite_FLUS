import { React, useState, useEffect } from 'react';
import './Comment.css';

const Responder = ({ responder }) => {
  return (
    <>
      <div className="responder">
        <div className="responder-info">
          <img src={profileimage} alt="profile" />
          <p>cogai20</p>
        </div>

        <div className="responder-content">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur autem a deserunt aliquam ex iure debitis quae
            dignissimos culpa! Autem eos quis aperiam possimus magni suscipit
            amet reiciendis, fugit sequi!
          </p>
        </div>
      </div>
    </>
  );
};

export default Responder;
