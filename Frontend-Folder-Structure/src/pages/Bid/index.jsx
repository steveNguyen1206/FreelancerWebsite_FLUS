import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './bid.css';
import exitButton from '../../assets/exitButton.png';
import bidServices from '@/services/bidServices';
import subcategoryService from '@/services/subcategoryService';
import gmailService from '@/services/gmailServices';
import userDataService from '@/services/userDataServices';

const isValidSkill = (skill) => {
  if (skill === '') return false;
  return true;
};

const isValidEmail = (email) => {
  if (email.length > 255) return false;
  if (email === '') return false;
  // email has valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidMessage = (message) => {
  return message.length >= 10 && message.length <= 512;
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

const BidPopup = ({ isOpen, isClose, projectPostId, onChange, budgetMin, budgetMax, ownerEmail }) => {
  const [showOverlay, setShowOverlay] = useState(isOpen);

  const initError = {
    skill: '',
    email: '',
    message: '',
    price: '',
    duration: '',
  };

  const initState = {
    skill: '',
    email: '',
    message: '',
    price: '',
    duration: '',
    proj_post_id: projectPostId,
  };

  const [bid, setBid] = useState(initState);
  const [error, setError] = useState(initError);
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTags();
  }, []);

  const getTags = () => {
    subcategoryService
      .findAll()
      .then((response) => {
        setTags(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBid({ ...bid, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = { ...initError };

    if (!isValidSkill(bid.skill)) {
      isValid = false;
      errors.skill = 'Invalid skill. Skill must be not empty.';
    }

    if (!isValidEmail(bid.email)) {
      isValid = false;
      errors.email = 'Invalid email. Email must have valid format.';
    }

    if (!isValidMessage(bid.message)) {
      isValid = false;
      errors.message =
        'Invalid message. Message must be not empty and have length between 10 and 512.';
    }
    if (!isValidPrice(bid.price)) {
      isValid = false;
      errors.price =
        'Invalid price. Price must be not empty and only have numbers.';
    }

    if (Number(bid.price) < budgetMin || Number(bid.price) > budgetMax) {
      isValid = false;
      errors.price =
        'Invalid price. Price must be in range of budget min and budget max.';
    }

    if (!isValidDuration(bid.duration)) {
      isValid = false;
      errors.duration =
        'Invalid duration. Duration must be not empty and only have numbers.';
    }

    setError(errors);
    return isValid;
  };

  // send email to project owner
  const emailData = {
    email: ownerEmail,
    url: 'http://localhost:8081/project/' + projectPostId,
  };

  const sendEmail = () => {
    gmailService.sendEmail(emailData).then((response) => {
      console.log('response: ', response);
    });
  };


  const handleDoneClick = () => {
    if (validateForm()) {
      bidServices
        .bidProject(bid, localStorage.getItem('AUTH_TOKEN'))
        .then(() => {
          console.log('Form is valid. Project submitted successfully.');
          setShowOverlay(false);
          sendEmail(); // send to project owner
          isClose();
          onChange();
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          console.error('Error submitting project:', error.message);
        });
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };

  return (
    <>
      {showOverlay && <div className="overlay" />}
      <div className="bid-popup">
        <button
          onClick={() => {
            setShowOverlay(false);
            isClose();
            onChange();
          }}
          className="exit-button"
        >
          <img src={exitButton} alt="Exit" />
        </button>
        <div className="bid-popup-header">
          <p>BID</p>
        </div>

        <div className="bid-popup-body">
          <div className="freelancer-skill-input">
            <label htmlFor="freelancerSkill">Skill *</label>
            <select
              id="freelancerSkill"
              name="skill"
              value={bid.skill}
              onChange={handleInputChange}
            >
              <option value="">Select skill tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.subcategory_name}
                </option>
              ))}
            </select>

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
            <label htmlFor="freelancerDuration">Duration(days) *</label>
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

          <div className="error-message">{errorMessage}</div>

          <WhiteButton text="Send" onClick={handleDoneClick} />
        </div>
      </div>
    </>
  );
};

export default BidPopup;
