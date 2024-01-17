import React from 'react';
import './signup_tab_third.css';
import authServices from '@/services/authServices';
import smsAuthenService from '@/services/smsAuthen';
import { useState } from 'react';

const convertToPhoneNumber = (phone) => {
  return '+84' + phone.substring(1);
};

const SignUpTabThird = ({
  setTab,
  signUpPayload,
  setSignUpPayload,
  onSignUp,
}) => {
  const signin = () => {
    var data = {
      account_name: signUpPayload.userName,
      password: signUpPayload.userPassword,
      profile_name: signUpPayload.realName,
      phone_number: signUpPayload.phone,
      nationality: signUpPayload.country,
      user_type: 1,
      email: signUpPayload.email,
      avt_url: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705132053/avatar_green_kunsk3.png",
      social_link: 'https://imgur.com/gallery/ApNKGxs',
    };

    authServices
      .signup(data)
      .then((response) => {
        if (response.status == 200) {
          // show a dialog to notify user that they have signed up successfully
          alert('Sign up successfully');
          console.log('Sign up successfully');
        }
      })
      .catch((e) => {
        alert(e.response.data.message);
        console.log(e);
      });
  };

  const [error, setError] = useState("");


  const handleEnterClick = () => {
    const smsMessage = {
      phone_number: convertToPhoneNumber(signUpPayload.phone),
      code: signUpPayload.code,
    };
    console.log('frontend: ', smsMessage);

    // signin();
    // onSignUp();

    
// >>>>>>> 2d84f5e00b58bcfe84fcff8f6bb86f9c2c19944a
    smsAuthenService
      .verifyCode(smsMessage)
      .then((response) => {
        if (response.status == 200) {
          signin();
          onSignUp();
        } else {
          console.log('Error: ', response.message);
          setError('Code is not correct, please try again');
        }
      })
      .catch((e) => {
        console.log('eRROR:', e.message);
        setError('Code is not correct, please try again');
      });
  };

  return (
    <div className="info-field">
      <div className="input-container">
        <label htmlFor="inputSMSCode" className="form-label">
          CODE
        </label>
        <div className="text-intro">
          We have sent a code to your phone number. Please check your phone and enter the code below.
        </div>
        <input
          id="inputSMSCode"
          type="text"
          name="code"
          className="form-control"
          placeholder="Enter code we send to your phone number..."
          aria-label=""
          aria-describedby="basic-addon1"
          onChange={(e) =>
            setSignUpPayload({ ...signUpPayload, code: e.target.value })
          }
        />
        <div className="error-message">{error}</div>
      </div>

      <div className='buttons-container'>

      <div onClick={() => setTab(2)} className="sign-up-button row">
        <div className="div-wrapper-b">
          <div className="text-wrapper-2">Back</div>
        </div>
      </div>
      </div>
      <div
        onClick={() => {
          handleEnterClick();
        }}
        className="sign-up-button row"
      >
        <div className="div-wrapper-n">
          <div className="text-wrapper-2-n">Enter</div>
        </div>
      </div>
    </div>
  );
};

export default SignUpTabThird;
