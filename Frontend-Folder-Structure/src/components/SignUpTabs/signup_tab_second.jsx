import React from 'react';
import './signup_tab_second.css';
import { useState } from 'react';
import smsAuthenService from '@/services/smsAuthen';
import userDataService from '@/services/userDataServices';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = async (phone) => {
  // the phone number is valid if it has 10 digits and starts with 0
  const phoneRegex = /^0[0-9]{9}$/;

  if (!phoneRegex.test(phone)) {
    console.log('1');
    return false;
  } else {
    // check if phone number is used by another account
    return userDataService
      .checkPhoneExist(phone)
      .then((response) => {
        console.log('chec phone exist');
        console.log(response.data.phoneExisted);
        if (response.data.phoneExisted == false) {
          console.log('2');
          return true;
        } else {
          console.log('3');
          return false;
        }
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }
};

const isValidName = (name) => {
  const nameRegex = /^\p{L}+\s*\p{L}*$/u;
  return nameRegex.test(name);
};

const isValidNationality = (nationality) => {
  const nationalityRegex = /^\p{L}+\s*\p{L}*$/u;
  return nationalityRegex.test(nationality);
};

const convertPhone = (phone) => {
  return '+84' + phone.substring(1);
};
const isValidPaymentAccount = (payment_account) => {
  const payment_accountRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return payment_accountRegex.test(payment_account);
};

const SignUpTabSecond = ({ setTab, signUpPayload, setSignUpPayload }) => {
  const handleChange = (event) => {
    setSignUpPayload({
      ...signUpPayload,
      [event.target.name]: event.target.value,
    });
  };

  const [OTPError, setOTPError] = useState('');
  const [error, setError] = useState({
    email: '',
    phone: '',
    realName: '',
    nationality: '',
    payment_account: '',
  });

  const isValidForm = async () => {
    return isValidPhone(signUpPayload.phone)
      .then((valid) => {
        // console.log('Check valid phone: ', valid);

        const errors = {
          email: isValidEmail(signUpPayload.email)
            ? ''
            : 'Invalid email address. Please enter a valid email address.',
          phone: valid ? '' : 'This phone number is invalid or already used.',
          realName: isValidName(signUpPayload.realName) ? '' : 'Invalid name.',
          nationality: isValidNationality(signUpPayload.nationality)
            ? ''
            : 'Invalid nationality.',
          payment_account: isValidPaymentAccount(signUpPayload.payment_account)
            ? ''
            : 'Invalid payment account.',
        };
        console.log(errors);
        setError(errors);
        return !Object.values(errors).some((error) => error !== '');
      })
      .catch((e) => {
        // console.log("check phone error");
        console.log(e);
      });
  };

  const handleVerifyClick = () => {
    console.log('handleVerifyClick');
    isValidForm()
      .then((valid) => {
        console.log('valid: ', valid);
        if (valid) {
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
              setOTPError(
                'Error while sending code, please check your phone number.'
              );
              console.log('SmsAuthenService error (client): ', e);
            });
        } else {
          console.log('Form is not valid. Please check the errors.');
        }
      })
      .catch((e) => {
        console.log('check form error');
        console.log(e);
      });
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

      <div className="input-container">
        <label htmlFor="inputName" className="form-label">
          Payment Account
        </label>
        <input
          type="text"
          id="inputName"
          className="form-control"
          name="payment_account"
          aria-describedby="passwordHelpBlock"
          value={signUpPayload.payment_account}
          onChange={handleChange}
        />
        <div className="error-message">{error.payment_account}</div>
      </div>

      <div className="error-message">{OTPError}</div>
      <div onClick={handleVerifyClick} className="sign-up-button">
        <div className="div-wrapper">
          <div className="text-wrapper-2">Verify</div>
        </div>
      </div>
    </div>
  );
};

export default SignUpTabSecond;
