import React from 'react';
import './signup_tab_first.css';
import googleIcon from '../../assets/SocialIcon/google.png';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import userDataService from '@/services/userDataServices';
import { useNavigate } from 'react-router';

const isValidPassword = (password) => {
  return password.length >= 8;
};

const verifyPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

const checkUserName = async (userName) => {
  if (userName.length == 0) {
    return 'Username is required.';
  } else if (userName.length < 6) {
    return 'Username must be at least 6 characters.';
  } else if (userName.length > 20) {
    return 'Username must be less than 20 characters.';
  } else if (!userName[0].match(/[a-zA-Z]/i)) {
    // user name starts with number or underscore
    return 'Username must start with alphabet.';
  } else if (!userName.match(/^[0-9a-zA-Z_]+$/i)) {
    // user name contains other character than number, alphabet and underscore
    return 'Username must contain only number, alphabet and underscore.';
  } else {
    // user name is already existed
    try {
      const response = await userDataService.findOnebyAccountName(userName);
      if (response.status == 200) {
        return 'Username is already existed.';
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }
};

const signUpTabFirst = ({ setTab, signUpPayload, setSignUpPayload }) => {
  const handleChange = (event) => {
    setSignUpPayload({
      ...signUpPayload,
      [event.target.name]: event.target.value,
    });
  };

  let navigate = useNavigate();

  const [error, setError] = useState({
    userName: '',
    userPassword: '',
    confirmPassword: '',
  });

  const isValidForm = async () => {
    const errors = {
      userName: await checkUserName(signUpPayload.userName),
      userPassword: isValidPassword(signUpPayload.userPassword)
        ? ''
        : 'Password must be at least 8 characters.',
      confirmPassword: verifyPassword(
        signUpPayload.userPassword,
        signUpPayload.confirmPassword
      )
        ? ''
        : 'Passwords do not match.',
    };
    setError(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  const handleSignUpClick = async () => {
    if (await isValidForm()) {
      setTab(2);
    } else {
      console.log('Form is not valid. Please check the errors.');
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenRespond) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenRespond.access_token}`,
            },
          }
        );

        console.log('MY DATA', res.data);

        try {
          const server_host = 'http://127.0.0.1:8080';
          // send result to backend
          const result = await axios.post(
            `${server_host}/api/auth/googleSignup`,
            {
              account_name: res.data['email'],
              // password: tokenRespond.access_token,
              password: res.data['sub'],
              profile_name: res.data['name'],
              nationality: res.data['locale'],
              user_type: false,
              email: res.data['email'],
              avt_url: res.data['picture'],
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenRespond.access_token}`,
              },
            }
          );

          console.log('Token: ' + result.data.accessToken);
          navigate(`/login`);
        } catch (error) {
          console.log('Error with GoogleSignup' + error);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    
    <div className="info-field">
      <div className="input-container">
        <label htmlFor="inputUsername" class="form-label">
          Username
        </label>
        <input
          id="inputUsername"
          type="text"
          name="userName"
          className="form-control"
          placeholder="Username"
          aria-label="Username"
          value={signUpPayload.userName}
          aria-describedby="basic-addon1"
          onChange={handleChange}
        />
        <div className="error-message">{error.userName}</div>
      </div>
      <div className="input-container">
        <label for="inputPassword5" class="form-label">
          Password
        </label>
        <input
          type="password"
          name="userPassword"
          id="inputPassword5"
          value={signUpPayload.userPassword}
          class="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={handleChange}
        />
        <div className="error-message">{error.userPassword}</div>
      </div>
      <div className="input-container">
        <label for="inputPassword6" class="form-label">
          Reconfirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="inputPassword6"
          value={signUpPayload.confirmPassword}
          class="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={handleChange}
        />
        <div className="error-message">{error.confirmPassword}</div>
      </div>

      <div onClick={handleSignUpClick} className="sign-up-button">
        <div className="div-wrapper">
          <div className="text-wrapper-2">Sign up</div>
        </div>
      </div>

      <div className="or-sign-up-using-wrapper">or continue with</div>
      <div className="frame-2">
        <img
          className="ellipse"
          alt="Ellipse"
          src={googleIcon}
          onClick={() => googleSignup()}
          
        />
        {/* <img className="img" alt="Ellipse" src={} /> */}
      </div>
    </div>
  );
};

export default signUpTabFirst;
