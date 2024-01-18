import React from 'react'
import './navbar.css'
import { useNavigate } from 'react-router'


const Navbar = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/');
  }
  const handleFindJobs = () => {
    navigate('/job');
  }
  const handleFindFreelancers = () => {
    navigate('/findfreelancer');
  }
  // const handleCommunity = () => {
  //   // navigate('/community');
  // }
  const handleAbout = () => {
    navigate('/aboutUs');
  }
  
  return (
    <div className="container text-center" style={{display:"flex", alignContent:"center", width:"100%", flexWrap:"wrap", }}>
      <div className="row" style={{margin:"0",width:"100%", paddingLeft:"10%", paddingRight:"8%"}}>
        <div className="col" style={{display:"flex", justifyContent: "center"}}>
          <div className="nav_text" onClick={handleHome}>Home</div>
        </div>
        <div className="col" style={{display:"flex", justifyContent: "center"}}>
          <div className="nav_text" onClick={handleAbout}>About</div>
        </div>
        <div className="col" style={{display:"flex", justifyContent: "center"}}>
          <div className="nav_text" onClick={handleFindJobs}>Find Projects</div>
        </div>
        <div className="col" style={{display:"flex", justifyContent: "center"}}>
          <div className="nav_text" onClick={handleFindFreelancers}>Find Freelancers</div>
        </div>
        {/* <div className="col" style={{display:"flex", justifyContent: "center"}}>
          <div className="nav_text" onClick={handleCommunity}>Community</div>
        </div> */}
        
      </div>
    </div>
  )
}

export default Navbar
