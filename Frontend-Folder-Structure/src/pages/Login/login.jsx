import React, { useState } from 'react';
import './login1.css';
import exitButton from '../../assets/exitButton.png';
import googleIcon from '../../assets/SocialIcon/google.png';
import authServices from '@/services/authServices';
import { useNavigate } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthProvider, useAuth } from '../../AuthContext';


const LogIn = () => {
  const { setSignin } = useAuth();
  const InititalLoginPayload = {
    userName: '',
    userPassword: '',
  };

  let navigate = useNavigate();

  const [loginPayload, setLoginPayload] = useState(InititalLoginPayload);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginPayload({ ...loginPayload, [name]: value });
  };

  let error = {
    username: '',
    password: '',
  };

  const signin = () => {
    var data = {
      account_name: loginPayload.userName,
      password: loginPayload.userPassword,
    };

    authServices
      .signin(data)
      .then((response) => {
        if (response.status == 200) {
          var id = response.data.id;
          localStorage.setItem('LOGINID',id);
          localStorage.setItem('AUTH_TOKEN',response.data.accessToken);
          localStorage.setItem('AVT', response.data.avt_url);
          console.log("AVATER", localStorage.getItem('AVT'));
          setSignin(true);
          navigate(`/myprofile/${id}`);
        }
        console.log(localStorage.getItem('AUTH_TOKEN'));
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          error.username = 'User Not found.';
        } else if (e.response && e.response.status === 401) {
          error.password = 'Invalid Password!';
        } else {
          console.log(e);
        }
      });
  };
  const googleLogIn = useGoogleLogin({
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

        try {
          const server_host = 'http://127.0.0.1:8080';
          // send result to backend
          const result = await axios.post(
            `${server_host}/api/auth/googleLogin`,
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
          localStorage.setItem('LOGINID',result.data.id);
          localStorage.setItem('AUTH_TOKEN',result.data.accessToken);
          // console.log("AVATAR GG", result.data.avt_url);
          localStorage.setItem('AVT', result.data.avt_url);
          console.log('Token: ' + result.data.accessToken + " " + result.data.id);
          setSignin(true);
        } catch (error) {
          console.log('Error with GoogleLogin' + error);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="main-container">
      <div className="pop-up-sign-in">
        <div className="signin-wrapper">
          <div className="navigation">
            <div className="header-popup-text">Sign In</div>
          </div>

          <div className="info-field">
            <div className="input-container">
              <label for="inputUsername" class="form-label">
                Username
              </label>
              <input
                id="inputUsername"
                name="userName"
                type="text"
                class="form-control"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={handleInputChange}
              />

              <div className="error-message">{error.username}</div>
            </div>
            <div className="input-container">
              <label for="inputPassword5" class="form-label">
                Password
              </label>
              <input
                type="password"
                name="userPassword"
                id="inputPassword5"
                class="form-control"
                aria-describedby="passwordHelpBlock"
                onChange={handleInputChange}
              />
              <div className="error-message">{error.password}</div>
            </div>

            <div className="sign-in-button">
              <div className="div-wrapper">
                <div className="text-wrapper-2" onClick={signin}>
                  Sign in
                </div>
              </div>
            </div>

            <div className="or-sign-in-using-wrapper">or continue with</div>
            <div className="frame-2">
              <img
                className="ellipse"
                alt="Ellipse"
                src={googleIcon}
                onClick={() => googleLogIn()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
