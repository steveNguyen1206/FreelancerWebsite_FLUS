import './FreelancerPostsTab.css';
import React, { useState, useEffect } from 'react';
import { FreelancerPost } from '@/components/JobPost';
import freelancer_post_Service from '@/services/freelancer_post_Service';

const FreelancerPostsTab = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await freelancer_post_Service.allposts(userId);
      setPosts(postsData.data);
      console.log('data', postsData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className='freelancer-posts-container'>
      {posts.map((post) => (
        <FreelancerPost
          key={post.id}
          post={post}
          post_id={post.id}
          freelancer_id={post.freelancer_id}
          about_me={post.about_me}
          lowest_price={post.lowest_price}
          skill_description={post.skill_description}
        />
      ))}
    </div>
  );
};

export default FreelancerPostsTab;
