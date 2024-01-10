import React from 'react';
import './CommentProjectPost.css';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import commentService from '@/services/commentServices';
import Commentator from './Commentator';
import Responder from './Responder';
import send from '../../assets/send.png';

const CommentProject = ({ project_post_id}) => {

  const [commentatorComment, setCommentatorComment] = useState('');
  const [responderComment, setResponderComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    fetchComment();
  }, [project_post_id]);

  const fetchComment = async () => {
    try {
      const commentData = await commentService.findCommentByProjectId(
        project_post_id
      );

      const sortedComments = commentData.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setCommentList(sortedComments);
    } catch (error) {
      console.error('Error fetching comment:', error);
    }
  };

  const handleViewMoreClick = () => {
    setVisibleComments((prevCount) => prevCount + 3);
  };

  const handleCommentChange = (event) => {
    setCommentatorComment(event.target.value);
  };

  const handleCommentatorSubmit = async () => {
    const comment = {
      comment: commentatorComment,
      proj_post_id: project_post_id,
      parent_id: null,
    };
    try {
      const commentData = await commentService.create(comment, localStorage.getItem('AUTH_TOKEN')).then((res) => {
        fetchComment();
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
    setCommentatorComment('');
  };

  const handleResponderSubmit = async (
    responderComment,
    project_post_id,
    parent_id
  ) => {
    const commentData = {
      comment: responderComment,
      proj_post_id: project_post_id,
      parent_id: parent_id,
    };

    console.log('comment data: ', commentData);

    try {
      const comment = await commentService.create(commentData).then((res) => {
        fetchComment();
      });
      // setCommentList(commentData.data);
    } catch (error) {
      console.error('Error creating comment:', error);
    }

    setResponderComment('');
  };

  return (
    <div className="comment-proj">
      <div className="input-comment">
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={commentatorComment}
          onChange={handleCommentChange}
        />
        <button className="comment-button" onClick={handleCommentatorSubmit}>
          <img className="send-icon" src={send} alt="send-icon" />
        </button>
      </div>

      <div className="list-comment">
        {commentList.slice(0, visibleComments).map((commentElement) => (
          <div key={commentElement.comment_id}>
            <Commentator
              user_id={commentElement.user_id}
              commentContent={commentElement.comment}
              dateCreated={commentElement.createdAt}
              comment_id={commentElement.id}
              project_post_id={project_post_id}
              handleResponderSubmit={handleResponderSubmit}
            />

            <div className="child-comment">
              {commentElement.childComments.map((childComment) => (
                <Responder
                  key={childComment.comment_id}
                  user_id={childComment.user_id}
                  commentContent={childComment.comment}
                  dateCreated={childComment.createdAt}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="view-more-container">
        {commentList.length > visibleComments && (
          <button className="view-more-btn" onClick={handleViewMoreClick}>
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentProject;
