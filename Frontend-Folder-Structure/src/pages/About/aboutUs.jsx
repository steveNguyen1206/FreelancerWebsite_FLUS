import React, {useState, useEffect} from "react";
import "./aboutUs.css";
import banner from "../../assets/banner.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import avatar from "../../assets/avatar_green.png";
import { StarRating } from "@/components";
import human from "../../assets/Human.png";
import { Carousel, CarouselItem } from "react-bootstrap";
import userDataServices from "../../services/userDataServices";
import bidService from "@/services/bidServices";
import Vy from "../../assets/AdminMem/Vy.jpg"
import Chan from "../../assets/AdminMem/Chan.jpg"
import Khang from "../../assets/AdminMem/Khang.jpg"
import Vien from "../../assets/AdminMem/Vien.jpg" 
import Dat from "../../assets/AdminMem/Dat.jpg"

const AboutUs = () => {

  const [userCount, setUserCount] = useState(0);
  const [acceptedBidCount, setAcceptedBidCount] = useState(0);
  const [waitingBidCount, setWaitingBidCount] = useState(0);
  const [acceptedContactCount, setAcceptedContactCount] = useState(0);


  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const users = await userDataServices.findAll(); // Call the findAll method
        console.log("users num:",  users.data.length);
        setUserCount(users.data.length); // Set the userCount state to the length of the users array
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    const fetchAcceptedBidCount = async () => {
      try {
        const accepted_user_id = await bidService.getDistinctUserIdsByStatus(1); // Call the findAll method
        console.log("accepted bid:",  accepted_user_id.data.length);
        setAcceptedBidCount(accepted_user_id.data.length); // Set the userCount state to the length of the users array
      } catch (error) {
        console.error("Error fetching accepted_user_id:", error);
      }
    };
    const fetchWaitingBidCount = async () => {
      try {
        const waiting_user_id = await bidService.getDistinctUserIdsByStatus(0); // Call the findAll method
        console.log("waiting bid:",  waiting_user_id.data.length);
        setWaitingBidCount(waiting_user_id.data.length); // Set the userCount state to the length of the users array
      } catch (error) {
        console.error("Error fetching waiting_user_id:", error);
      }
    };
    const fetchAcceptedContactCount = async () => {
      try {
        const accepted_client_id = await bidService.getDistinctUserIdsByStatus(1); // Call the findAll method
        console.log("accepted bid:",  accepted_client_id.data.length);
        setAcceptedContactCount(accepted_client_id.data.length); // Set the userCount state to the length of the users array
      } catch (error) {
        console.error("Error fetching accepted_client_id:", error);
      }
    };
    fetchAcceptedContactCount();
    fetchWaitingBidCount();
    fetchAcceptedBidCount();
    fetchUserCount();
  }, []);

  

  const carousel_settings = {
    dots: true,
    infinite: true,
    arrows: true, 
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="about-us">
      <div className="div">
      <div className="overlap-2">
        <div className="about-us-banner">
          <div className="about-us-text-wrapper-12">About FLUS</div>
          <div className="rectangle-4" />
          <p className="about-us-text-wrapper-11">
          Transform your projects with FLUS! Discover a world of elite freelancers, streamline collaboration, and witness unparalleled success. Elevate your vision, connect effortlessly, and experience the future of freelance excellence. FLUS - where projects meet perfection!
          </p>
          <div className="to-instruction-txt">
            To Instruction
          </div>
        </div>
      </div>
      <div className="frame">
        <p className="experts-title">We Are a Team of Experts</p>
        <Slider {...carousel_settings} >
          <div>
            <div className="frame-2">
              <img className="about-avatar-wrapper" alt="Ellipse" src={Khang}/>
              <div className="founder-name">Ho Duy Khang</div>
              <div className="text-wrapper-6">~ o ~</div>
              <p className="founder-instruction">
                Ho Duy Khang is the Project Manager and Backend Software Engineer of Freelancer US.
              </p>
            </div>
          </div>
          <div>
            <div className="frame-2">
              <img className="about-avatar-wrapper" alt="Ellipse" src={Chan}/>
              <div className="founder-name">Nguyen Hai Chan</div>
              <div className="text-wrapper-6">~ o ~</div>
              <p className="founder-instruction">
                Nguyen Hai Chan is the Backend Technical Leader of Freelancer US.
              </p>
            </div>
          </div>
          <div>
            <div className="frame-2">
              <img className="about-avatar-wrapper" alt="Ellipse" src={Vien}/>
              <div className="founder-name">Vo Hoang Hoa Vien</div>
              <div className="text-wrapper-6">~ o ~</div>
              <p className="founder-instruction">
                Vo Hoang Hoa Vien is the Frontend Software Engineer of Freelancer US.
              </p>
            </div>
          </div>
          <div>
            <div className="frame-2">
              <img className="about-avatar-wrapper" alt="Ellipse" src={Dat}/>
              <div className="founder-name">Le Thanh Dat</div>
              <div className="text-wrapper-6">~ o ~</div>
              <p className="founder-instruction">
              Le Thanh Dat is the Backend Software Engineer of Freelancer US.
              </p>
            </div>
          </div>
          <div>
            <div className="frame-2">
              <img className="about-avatar-wrapper" alt="Ellipse" src={Vy}/>
              <div className="founder-name">Nguyen Thi Truc Vy</div>
              <div className="text-wrapper-6">~ o ~</div>
              <p className="founder-instruction">
                Nguyen Thi Truc Vy is the Frontend Technical Leader of Freelancer US.
              </p>
            </div>
          </div>
          
        </Slider>
      </div>
      <div className="expert-review-section">
        <Carousel data-bs-theme="dark" interval={null}>
          <CarouselItem>
            <div style={{width:"1110px"}}>
              <div className="review-container row">
                <div className="col" style={{height:"100%", alignItems:"flex-end"}}>
                  <img className="rectangle-5" alt="Rectangle" src={human} />
                </div>
                <div className="col" style={{flexDirection:"column"}}>
                  <p className="reviewer-quote">
                  I recently experienced FLUS, and I'm thoroughly impressed! As an expert in the freelance industry, I can confidently say it's a game-changer. The user-friendly interface simplifies project posting, and the diverse pool of skilled freelancers is exceptional. Kudos to FLUS for transforming the freelance landscape!
                  </p>
                  <div className="star-rating-wrapper">
                    <StarRating rating={4} width={200}/>
                  </div>
                </div>
              </div>
            </div>
            
          </CarouselItem>
          <CarouselItem>
            <div className="review-container row">
              <div className="col" style={{height:"100%", alignItems:"flex-end"}}>
                <img className="rectangle-5" alt="Rectangle" src={human} />
              </div>
              <div className="col" style={{flexDirection:"column"}}>
                <p className="reviewer-quote">
                FLUS is a game-changer! As a seasoned expert, I've found top-notch freelancers effortlessly. The platform's intuitive design, diverse talent pool, and seamless communication tools make it my go-to for project success. Highly recommended!
                </p>
                <div className="star-rating-wrapper">
                  <StarRating rating={4} width={200}/>
                </div>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="review-container row">
              <div className="col" style={{height:"100%", alignItems:"flex-end"}}>
                <img className="rectangle-5" alt="Rectangle" src={human} />
              </div>
              <div className="col" style={{flexDirection:"column"}}>
                <p className="reviewer-quote">
                FLUS is a revelation in the freelance world! Having navigated numerous platforms, FLUS stands out for its remarkable simplicity and effectiveness. As an expert, I appreciate the seamless project posting process and the diverse array of highly skilled freelancers available. 
                </p>
                <div className="star-rating-wrapper">
                  <StarRating rating={4} width={200}/>
                </div>
              </div>
            </div>
          </CarouselItem>
        </Carousel>
      </div>
      <div className="StatisticSection">
        <div className="inner-post">
          <div className="text-wrapper-10">Our Achievements</div>
          <div className="result-container">
            <div className="row">
              <div className="text-wrapper-7 col-9">Total Users: </div>
              <div className="col-3">{userCount} </div>
            </div>
            <div className="row">
              <div className="text-wrapper-7  col-9">People having a job: </div>
              <div className="col-3">{acceptedBidCount} </div>
            </div>
            {/* <div className="row">
              <div className="text-wrapper-7  col-9">People waiting: </div>
              <div className="col-3">{waitingBidCount} </div>
            </div> */}
            <div className="row">
              <div className="text-wrapper-7  col-9">Clients find their freelancers: </div>
              <div className="col-3">{acceptedContactCount} </div>
            </div>
          </div>
          
        </div>
      </div>

      
    </div>
  </div>
  );
};


export default AboutUs;