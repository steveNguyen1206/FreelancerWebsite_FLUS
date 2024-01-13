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
import HireFreelancer from '@/pages/FreelancerPost/hireFreelancer';
import ApproveOffer from '@/pages/FreelancerPost/approveOffer';
import { jwtDecode } from 'jwt-decode';

const FindFreelancer = () => {
  const userId = localStorage.getItem('LOGINID');
  console.log('userId', userId);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await freelancer_post_Service.activePosts();
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
  useEffect(() => {
    if (isChange) {
      fetchPosts();
      setIsChange(false);
    }
  }, [isChange]);

  const [sortOption, setSortOption] = useState('');

  const [searchTitle, setSearchTitle] = useState('');
  const handleSearchChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const [selectedTags, setSelectedTags] = useState([]);
  const handleFilterChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
  };

  const [selectedRange, setSelectedRange] = useState([0, 10000]);
  const handleRangeChange = (newSelectedRange) => {
    setSelectedRange(newSelectedRange);
  };
  console.log('posts', posts);
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      // if selectedTags is empty, ignore the tag filter
      (selectedTags.length === 0 || selectedTags.includes(post.subcategory.id)) &&
      post.lowset_price >= selectedRange[0] &&
      post.lowset_price <= selectedRange[1]
  );
  console.log('selectedRange', selectedRange);

  const subcategory_ids = posts.map((post) => post.subcategory_id);
  console.log('subcategory_ids', subcategory_ids);
  const sortPosts = (posts) => {
    switch (sortOption) {
      case 'price-asc':
        return posts.sort((a, b) => a.lowset_price - b.lowset_price);
      case 'price-desc':
        return posts.sort((a, b) => b.lowset_price - a.lowset_price);
      case 'review-asc':
        return posts.sort((a, b) => a.ownerRating - b.ownerRating);
      case 'review-desc':
        return posts.sort((a, b) => b.ownerRating - a.ownerRating);
      default:
        return posts;
    }
  };
  console.log('filteredPosts', filteredPosts); 

  return (
    <>
      {(userId != null) && isOpen && <NewPost isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdate={() => { setIsChange(true) }} />}
      {/* {isOpen && <ApproveOffer isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdate = {() => {setIsChange(true)}} />} */}
      <div className="job-page">
        <div className="content">
          <div className="containerp">
            <div className="topbar">
              <div className="button">
                {/* <button className="btn-new-post" onClick={event =>  window.location.href='/createFreelancerPost'}>+ New Post</button> */}
                {userId && (<button className="btn-new-post" onClick={handleNewPost}>+ New Post</button>)}
              </div>
              <Search 
                onSearchChange={handleSearchChange} 
                />
              <select 
                value={sortOption}
                className="sort"
                onChange={(event) => setSortOption(event.target.value)}
              >
                <option value="" disabled defaultValue>
                  Sort
                </option>
                <option value="price-asc">Price ascending</option>
                <option value="price-desc">Price descending</option>
                {/* <option value="review-asc">Review</option>
                <option value="review-desc">Review</option> */}
              </select>
            </div>
          </div>
        </div>

        <div className="c-container">
          <div className="left-job">
            <Filter
              selectedTags={selectedTags}
              onSelectedTagsChange={handleFilterChange}
              onSelectedRangeChange={handleRangeChange}
            />
          </div>
          <div className="right-job">
            {/* <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/>
            <FreelancerPost post = {post}/> */}
            {sortPosts(filteredPosts).map(post => (
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
