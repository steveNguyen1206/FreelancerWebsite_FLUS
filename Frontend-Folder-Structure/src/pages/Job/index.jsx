import React from 'react';
import './Job.css';
import Search from '@/components/Search';
import { Header, Footer } from '@/layout';
import Post from '@/components/JobPost';
import Filter from '@/components/Filter';

const index = () => {
  return (
    <>
      <div className="job-page">
        <div className="content">
          <div className="containerp">
            <div className="topbar">
              <div className="button">
                <button className="btn-new-post">+ New Post</button>
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
          <div className="left">
            <Filter />
          </div>
          <div className="right">
            <Post />
            <Post />
            <Post />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
