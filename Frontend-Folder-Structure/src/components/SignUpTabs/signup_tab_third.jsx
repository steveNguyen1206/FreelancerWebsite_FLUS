import React from 'react';
import './signup_tab_third.css';
import authServices from '@/services/authServices';
import smsAuthenService from '@/services/smsAuthen';

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
          console.log('Sign up successfully');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const error = {
    code: '',
  };

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
          error.code = 'Code is not correct, please try again';
        }
      })
      .catch((e) => {
        console.log('eRROR:', e.message);
        error.code = 'Code is not correct, please try again';
      });
  };

  return (
    <div className="info-field">
      <div className="input-container">
        <label htmlFor="inputSMSCode" className="form-label">
          CODE
        </label>
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
        <div className="error-message">{error.code}</div>
      </div>

      <div onClick={() => setTab(2)} className="sign-up-button row">
        <div className="div-wrapper-b">
          <div className="text-wrapper-2">Back</div>
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
