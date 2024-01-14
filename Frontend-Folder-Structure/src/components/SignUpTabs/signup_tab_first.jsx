import React from 'react';
import './signup_tab_first.css';
import googleIcon from '../../assets/SocialIcon/google.png';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const isValidPassword = (password) => {
  return password.length >= 8;
};

const verifyPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

const checkUserName = (userName) => {
  if (userName.length == 0) {
    return 'Username is required.';
  } else if (userName.length < 6) {
    return 'Username must be at least 6 characters.';
  } else if (userName.length > 20) {
    return 'Username must be less than 20 characters.';
  }
  return '';
};

const signUpTabFirst = ({ setTab, signUpPayload, setSignUpPayload }) => {
  const handleChange = (event) => {
    setSignUpPayload({
      ...signUpPayload,
      [event.target.name]: event.target.value,
    });
  };

  const [error, setError] = useState({
    userName: '',
    userPassword: '',
    confirmPassword: '',
  });

  const isValidForm = () => {
    const errors = {
      userName: checkUserName(signUpPayload.userName),
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

  const handleSignUpClick = () => {
    if (isValidForm()) {
      setTab(2);
    } else {
      console.log('Form is not valid. Please check the errors.');
    }
  };


  const googleSignup = useGoogleLogin({
    onSuccess: async(tokenRespond) => {
        try {
            const res = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${tokenRespond.access_token}`,
                    },
                }
                )
                
            console.log("MY DATA", res.data);

            try {
                const server_host = "http://127.0.0.1:8080";
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
                        "Content-Type": "application/json", 
                        Authorization: `Bearer ${tokenRespond.access_token}`,
                    
                        },
                    }
                );

                console.log("Token: " + result.data.accessToken);
            } catch (error) {
                console.log("Error with GoogleSignup" + error)
            }

        } catch (error) {
            console.log(error)
        }
    }
  });

  return (
    <div className="info-field">
      <div className="input-container">
        <label for="inputUsername" class="form-label">
          Username
        </label>
        <input
          id="inputUsername"
          type="text"
          name="userName"
          class="form-control"
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
        <img className="ellipse" alt="Ellipse" src={googleIcon} onClick={() => googleSignup()}/>
        {/* <img className="img" alt="Ellipse" src={} /> */}
      </div>
    </div>
  );
};

export default signUpTabFirst;
