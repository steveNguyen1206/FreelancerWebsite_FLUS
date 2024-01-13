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

export const commentService = {
  create,
  findCommentByProjectId,
};

export default commentService;
