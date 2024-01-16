import React, {useState, useEffect} from 'react'
import './home.css'
import { HorizonFreelancerPostCell, Inputs, Modal, ToolTip } from '@/components'
import { Header, Footer, Navbar } from '@/layout'
import banner from '../../assets/banner.jpg'
import human from '../../assets/Human.png'
import skill from '../../assets/skill.png'
import { FreelancerPost, Post } from '@/components/JobPost'
import freelancer_post_Service from '@/services/freelancer_post_Service'
import Slider from 'react-slick'
import categoryService from '@/services/categoryService'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

const index = () => {

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await freelancer_post_Service.allAllPosts();
      const sortedPosts = postsData.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setPosts(sortedPosts);
      console.log('data', sortedPosts);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const carousel_settings = {
    dots: true,
    infinite: true,
    arrows: true, 
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
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
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.findAll();
      console.log('CATEGORIES', categoriesData.data);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    // Add the category to the URL as a query parameter
    navigate(`/findFreelancer?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className='homepage'>
      <div className="BannerSection">
        <img className="magnificent-view" alt="Magnificent view" src={banner} />
        <div className="rectangle" />
        <p className="text-wrapper"> Remember to keep your presentation focused and engaging while providing a comprehensive overview of the topic. Water quality and pollution in the natural environment are critical issues. </p>
        
        <div className="text-wrapper-2">FLUS</div>
        <img className="img" alt="Rectangle" src={human} />
        <div className='ButtonInBanner'>
          <div className="button-wrapper-1">
            <div className="text-wrapper-3" onClick={() => {navigate('/findfreelancer')}}>Find Freelancers</div>
          </div>
          <div className="button-wrapper-2">
            <div className="text-wrapper-4" onClick={() =>{navigate('/job')}}>Find Projects</div>
          </div>
        </div>
      </div>
      <div className='CategorySection'>
        <div className='home-category-wrapper'>
          <div className="ctn-category">
            <div className="txt-category">Category</div>
          </div>
          <div className='container' id='category-container_201123' style={{height:"100%", width:"100%", padding:"2% 5% 2% 5%"}}>
            <div className='row row-cols-7' style={{height:"100%", width:"100%", margin:"0"}}>
            {categories.map((category, index) => (
              <Link className='col' key={index} to={`/findFreelancer?category=${encodeURIComponent(category.name)}&categoryId=${category.id}`}>
                    <div className="group-3">
                      <img className="image" alt="Image" src={category.img} />
                      <div className="text-wrapper-5">{category.name}</div>
                      
                    </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        

      </div>
      <div className='ProjectSection'>
        <div className='project-header'>
          Latest Freelancer Posts
        </div>
        <Slider {...carousel_settings} className='project-container'>
          {posts.map(post => (
            <HorizonFreelancerPostCell 
              key={post.id} post={post}
              post_id={post.id}
              freelancer_id={post.freelancer_id}
              about_me={post.about_me}
              lowest_price={post.lowest_price}
              skill_description={post.skill_description}
              
            />
          ))}
        </Slider>
      </div>

    </div>
  )
}

export default index

