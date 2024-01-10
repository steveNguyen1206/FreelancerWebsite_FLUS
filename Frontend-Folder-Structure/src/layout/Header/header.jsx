import React, { useEffect, useState } from 'react'
import styles from './header.module.css'
import { Navbar } from '..'
import logo from '../../assets/logo.png'
import avatar_green from '../../assets/avatar_green.png'
import { StarRating } from '@/components'
import { useNavigate } from 'react-router';
import { AuthProvider, useAuth } from '../../AuthContext';


const Header = () => {
  const { signin, setSignin } = useAuth();
  const handleSignOut = () => {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('LOGINID');
    localStorage.removeItem('AVT');
    setSignin(false);
    window.location.href='/login';
  }
  const avatarSrc = localStorage.getItem('AVT') !== null && localStorage.getItem('AVT') !== 'https://imgur.com/gallery/ApNKGxs' ? localStorage.getItem('AVT') : avatar_green;
  return (
    <div className={styles.header}>
      <img src={logo} style={{padding:"15px", marginLeft:"2%"}}/>
      <Navbar></Navbar>
      <div className='button-avatar' style={{display: "flex",flexWrap:"wrap" ,alignContent:"center", width:"250px", height:"100%" , marginRight:"3%", padding: "0.75%"}}>
        {signin && (
          <button onClick={handleSignOut} className="btn btn-light">Sign Out</button>
        )}
        {!signin && (
          <div style={{display: "flex",flexWrap:"wrap" , alignContent:"center",width:"100%"}}>
            <div id='login_button-201123' className='btn btn-light'  onClick={event =>  window.location.href='/login'} >Login</div>
            <div id='Signup_button-201123' className='btn btn-light'  onClick={event =>  window.location.href='/signup'} style={{marginLeft:"3%"}}>Signup</div>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default Header
