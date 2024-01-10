import React, { useState, useEffect } from 'react';
import './findFreelancer.css';
import Search from '@/components/Search';
import { Header, Footer } from '@/layout';
import Post from '@/components/JobPost/Post';
import Filter from '@/components/Filter';
import { FreelancerPost } from '@/components/JobPost';
import { useNavigate } from 'react-router';
// import { FreelancerPostService } from '@/services';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import NewPost from '@/pages/FreelancerPost/newPost';
import HireFreelancer  from '@/pages/FreelancerPost/hireFreelancer';
import  ApproveOffer  from '@/pages/FreelancerPost/approveOffer';
import { jwtDecode  } from 'jwt-decode';

const FindFreelancer = () => {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await freelancer_post_Service.allposts();
      setPosts(postsData.data);
      console.log('data', postsData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleNewPost = () => {
    setIsOpen(true);
  };
  const [isChange, setIsChange] = useState(false);
  const hadleClickPost = (postId) => {
    navigate(`/freelancer_post/${postId}`)
  }
  // useEffect(() => {
  //   // Fetch data from the API endpoint
  //   fetch('http://localhost:8080/api/freelancer_post/allposts')
  //     .then(response => response.json())
  //     .then(data => setPosts(data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);


  return (
    <>
    {isOpen && <NewPost isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdate = {() => {setIsChange(true)}} />}
    {/* {isOpen && <ApproveOffer isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdate = {() => {setIsChange(true)}} />} */}
      <div className="job-page">
        <div className="content">
          <div className="containerp">
            <div className="topbar">
              <div className="button">
                {/* <button className="btn-new-post" onClick={event =>  window.location.href='/createFreelancerPost'}>+ New Post</button> */}
                <button className="btn-new-post" onClick={handleNewPost}>+ New Post</button>
              </div>
              <Search />
              <select className="sort">
                <option value="" disabled defaultValue>
                  Sort
                </option>
                <option value="price">Price</option>
                <option value="review">Review</option>
              </select>
            </div>
          </div>
        </div>

        <div className="c-container">
          <div className="left-job">
            <Filter />
          </div>
          <div className="right-job">
            {/* <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/> */}
            {posts.map(post => (
            <FreelancerPost 
              key={post.id} post={post}
              post_id={post.id}
              freelancer_id={post.freelancer_id}
              about_me={post.about_me}
              lowest_price={post.lowest_price}
              skill_description={post.skill_description}
              
            />
          ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FindFreelancer;
