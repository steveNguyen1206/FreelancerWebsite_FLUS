import { http } from './http-common';

const create = (data, access_token) => {
  return http.post('/comment', data, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const findCommentByProjectId = (project_id) => {
  return http.get(`/comment/findCommentByProjectId/${project_id}`);
};

const findAndChangeStatusByUserID = (user_id, status) => {
  return http.post(`/comment/findAndChangeStatusByUserID/${user_id}&${status}`);
};

export const commentService = {
  create,
  findCommentByProjectId,
  findAndChangeStatusByUserID,
};

export default commentService;
