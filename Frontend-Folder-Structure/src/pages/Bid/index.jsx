import React, { useState } from 'react';
import { WhiteButton } from '@/components';
import './bid.css';
import exitButton from '../../assets/exitButton.png';

const isValidName = (name) => {
  if (name === '') return false;
  // name is not empty and contains only letters
  const nameRegex = /^[a-zA-Z\s]*$/;
  return nameRegex.test(name);
};

const isValidSkill = (skill) => {
  if (skill === '') return false;
  // skill is not empty and contains only letters
  const skillRegex = /^[a-zA-Z\s]*$/;
  return skillRegex.test(skill);
};

const isValidEmail = (email) => {
  if (email === '') return false;
  // email has valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidMessage = (message) => {
  if (message === '') return false;
  // message is not empty and contains at least 10 characters
  const messageRegex = /^.{10,}$/;
  return messageRegex.test(message);
};

const isValidPrice = (price) => {
  if (price === '') return false;
  // price is not empty and contains only numbers
  if (Number(price) < 0) return false;
  const priceRegex = /^[0-9]*$/;
  return priceRegex.test(price);
};

const isValidDuration = (duration) => {
  if (duration === '') return false;
  // duration is not empty and contains only numbers
  if (Number(duration) < 0) return false;
  const durationRegex = /^[0-9]*$/;
  return durationRegex.test(duration);
};

const BidPopup = () => {
  const initError = {
    name: '',
    skill: '',
    email: '',
    message: '',
    price: '',
    duration: '',
  };

  const initState = {
    name: '',
    skill: '',
    email: '',
    message: '',
    price: '',
    duration: '',
  };

  const [bid, setBid] = useState(initState);
  const [error, setError] = useState(initError);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBid({ ...bid, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = { ...initError };

    if (!isValidName(bid.name)) {
      isValid = false;
      errors.name = 'Invalid name';
    }

    if (!isValidSkill(bid.skill)) {
      isValid = false;
      errors.skill = 'Invalid skill';
    }

    if (!isValidEmail(bid.email)) {
      isValid = false;
      errors.email = 'Invalid email';
    }

    if (!isValidMessage(bid.message)) {
      isValid = false;
      errors.message = 'Invalid message';
    }

    if (!isValidPrice(bid.price)) {
      isValid = false;
      errors.price = 'Invalid price';
    }

    if (!isValidDuration(bid.duration)) {
      isValid = false;
      errors.duration = 'Invalid duration';
    }

    setError(errors);
    return isValid;
  };

  const handleDoneClick = () => {
    if (validateForm()) {
      bidProject(bid)
        .then(() => {
          console.log('Form is valid. Project submitted successfully.');
        })
        .catch((error) => {
          console.error('Error submitting project:', error.message);
        });
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };

  return (
    <div className="bid-popup">
      <button className="exit-button">
        <img src={exitButton} alt="Exit" />
      </button>
      <div className="bid-popup-header">
        <p>BID</p>
      </div>

      <div className="bid-popup-body">
        <div className="freelancerNameInput">
          <label htmlFor="freelancerName">Freelancer's Name *</label>
          <input
            type="text"
            id="freelancerName"
            name="name"
            placeholder="Enter name ..."
            onChange={handleInputChange}
            value={bid.name}
          />
          <div className="error-message">{error.name}</div>
        </div>
        <div className="freelancer-skill-input">
          <label htmlFor="freelancerSkill">Skill *</label>
          <input
            type="text"
            id="freelancerSkill"
            name="skill"
            placeholder="Add skill tag"
            onChange={handleInputChange}
            value={bid.skill}
          />
          <div className="error-message">{error.skill}</div>
        </div>

        <div className="freelancer-email-input">
          <label htmlFor="freelancerEmail">Email *</label>
          <input
            type="email"
            id="freelancerEmail"
            name="email"
            placeholder="E.g: abc@gmail.com"
            onChange={handleInputChange}
            value={bid.email}
          />
          <div className="error-message">{error.email}</div>
        </div>

        <div className="freelancer-message-input">
          <label htmlFor="freelancerMessage">Message *</label>
          <textarea
            type="text"
            id="freelancerMessage"
            name="message"
            placeholder="Enter message ..."
            onChange={handleInputChange}
            value={bid.message}
          />
          <div className="error-message">{error.message}</div>
        </div>

        <div className="freelancer-price-input">
          <label htmlFor="freelancerPrice">Price *</label>
          <input
            type="text"
            id="freelancerPrice"
            name="price"
            placeholder="Enter price ..."
            onChange={handleInputChange}
            value={bid.price}
          />
          <div className="error-message">{error.price}</div>
        </div>

        <div className="freelancer-duration-input">
          <label htmlFor="freelancerDuration">Duration *</label>
          <input
            type="text"
            id="freelancerDuration"
            name="duration"
            placeholder="Enter duration ..."
            onChange={handleInputChange}
            value={bid.duration}
          />
          <div className="error-message">{error.duration}</div>
        </div>

        <WhiteButton name="Send" onClick={handleDoneClick} />
      </div>
    </div>
  );
};

export default BidPopup;
