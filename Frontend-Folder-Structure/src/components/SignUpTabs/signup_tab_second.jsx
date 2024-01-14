import React from 'react';
import './signup_tab_second.css';
import googleIcon from '../../assets/SocialIcon/google.png';
import { useState } from 'react';
import smsAuthenService from '@/services/smsAuthen';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // the phone number must has 10 exactly digits
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s]*$/;
  return nameRegex.test(name);
};

const isValidNationaity = (nationality) => {
  const nationalityRegex = /^[a-zA-Z\s]*$/;
  return nationalityRegex.test(nationality);
}

const convertPhone = (phone) => {
  return '+84' + phone.substring(1);
}


const SignUpTabSecond = ({ setTab, signUpPayload, setSignUpPayload }) => {
  const handleChange = (event) => {
    setSignUpPayload({
      ...signUpPayload,
      [event.target.name]: event.target.value,
    });
  };

  const [error, setError] = useState({
    email: '',
    phone: '',
    realName: '',
    nationality: '',
  });

  const isValidForm = () => {
    const errors = {
      email: isValidEmail(signUpPayload.email) ? '' : 'Invalid email address.',
      phone: isValidPhone(signUpPayload.phone) ? '' : 'Invalid phone number.',
      realName: isValidName(signUpPayload.realName) ? '' : 'Invalid name.',
      nationality: isValidNationaity(signUpPayload.nationality) ? '' : 'Invalid nationality.',
    };
    setError(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  const handleVerifyClick = () => {
    if (isValidForm()) {
      console.log(signUpPayload.phone);
      var phoneNum = {
        phone_number: convertPhone(signUpPayload.phone),
      };
      setTab(3);
      smsAuthenService
        .sendCode(phoneNum)
        .then((response) => {
          if (response.status == 200) {
            setTab(3);
          }
        })
        .catch((e) => {
          console.log('SmsAuthenService error (client): ', e);
        });
    } else {
      console.log('Form is not valid. Please check the errors.');
    }
  };

  return (
    <div className="info-field">
      <div className="input-container">
        <label htmlFor="inputEmail" className="form-label">
          Email
        </label>
        <input
          id="inputEmail"
          type="text"
          className="form-control"
          name="email"
          value={signUpPayload.email}
          onChange={handleChange}
        />
        <div className="error-message">{error.email}</div>
      </div>
      <div className="input-container">
        <label htmlFor="inputPhone" className="form-label">
          Phone number
        </label>
        <input
          type="text"
          id="inputPhone"
          name="phone"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          value={signUpPayload.phone}
          onChange={handleChange}
        />
        <div className="error-message">{error.phone}</div>
      </div>
      <div className="input-container">
        <label htmlFor="inputName" className="form-label">
          User's Name
        </label>
        <input
          type="text"
          id="inputName"
          className="form-control"
          name="realName"
          aria-describedby="passwordHelpBlock"
          value={signUpPayload.realName}
          onChange={handleChange}
        />
        <div className="error-message">{error.realName}</div>
      </div>
      <div className="input-container">
        <label htmlFor="inputName" className="form-label">
          Nationality
        </label>
        <input
          type="text"
          id="inputName"
          className="form-control"
          name="nationality"
          aria-describedby="passwordHelpBlock"
          value={signUpPayload.nationality}
          onChange={handleChange}
        />
        <div className="error-message">{error.nationality}</div>
      </div>

      <div onClick={handleVerifyClick} className="sign-up-button">
        <div className="div-wrapper">
          <div className="text-wrapper-2">Verify</div>
        </div>
      </div>
    </div>
  );
};

export default SignUpTabSecond;
