import React from 'react';
import './CommentProject.css';
import profileimage from '../../assets/profile_image.png';
import vietnam from '../../assets/vietnam.png';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import userDataService from '../../services/userDataServices';
import commentService from '@/services/commentServices';
// import SmallComment from './SmallComment';

const CommentProject = ({ project_post_id, user_id }) => {
  // fetch comment, display comment

  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    fetchComment();
  }, [project_post_id]);

  const fetchComment = async () => {
    try {
      const commentData = await commentService.getComment(project_post_id);
      setCommentList(commentData.data);
      console.log('comment data: ', commentData.data);
    } catch (error) {
      console.error('Error fetching comment:', error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    console.log('Submitted comment:', comment);

    setComment('');
  };

  return (
    <div className="comment">
      <div className="list-comment">
        {/* {commentList.map((comment) => (
          <SmallComment user_id={comment.user_id} comment={comment.comment} />
        ))} */}
      </div>
      <div className="input-comment">
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <button className="comment-button" onClick={handleCommentSubmit}>
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentProject;
