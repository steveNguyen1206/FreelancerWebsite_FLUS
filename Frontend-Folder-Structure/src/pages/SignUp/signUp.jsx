import React from 'react';
import './signUp.css';
import exitButton from '../../assets/exitButton.png';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SignUpTabFirst, SignUpTabSecond, SignUpTabThird } from '@/components';
// account_name: req.body.account_name,
// password: bcrypt.hashSync(req.body.password, 8),
// profile_name: req.body.profile_name,
// phone_number: req.body.phone_number,
// nationality: req.body.nationality,
// user_type: req.body.user_type,
// email: req.body.email,
// avt_url: req.body.avt_url,
// social_link: req.body.social_link,



const SignUp = () => {
  const [tab, setTab] = useState(1);
  const initSignUpPayload = {
    userName: '',
    userPassword: '',
    confirmPassword: '',
    email: '',
    phone: '',
    realName: '',
    nationality: '',
    code: '',
    payment_account: '',
  };

  let navigate = useNavigate();

  const [signUpPayload, setSignUpPayload] = useState(initSignUpPayload);

  const handleSignUp = () => {
    navigate(`/login`);
  };

  return (
    <div
      className='main-container'
    >
      <div className="pop-up-sign-up">
        <div className="signup-wrapper">
          <div className="navigation">
            <div className="header-popup-text">Sign Up</div>
            
          </div>

          {tab === 1 && (
            <SignUpTabFirst
              setTab={setTab}
              signUpPayload={signUpPayload}
              setSignUpPayload={setSignUpPayload}
            />
          )}
          {tab === 2 && (
            <SignUpTabSecond
              setTab={setTab}
              signUpPayload={signUpPayload}
              setSignUpPayload={setSignUpPayload}
            />
          )}
          {tab === 3 && (
            <SignUpTabThird
              setTab={setTab}
              signUpPayload={signUpPayload}
              setSignUpPayload={setSignUpPayload}
              onSignUp={handleSignUp}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
