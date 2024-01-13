import { media_upload, http } from './http-common';

const findOnebyId = (id) => {
  return http.get(`/project_post/${id}`);
};

const sendProject = async (data) => {
  let formData = new FormData();
  formData.append('title', data.title);
  formData.append('detail', data.detail);
  formData.append('budget_min', data.budgetMin);
  formData.append('budget_max', data.budgetMax);
  formData.append('tag_id', data.tag_id);
  formData.append('user_id', 1);
  formData.append('image_file', data.image);

  console.log('formData: ', formData);
  return media_upload.post('/project_post/', formData);
};

const updateProject = async (data) => {
  let formData = new FormData();
  formData.append('title', data.title);
  formData.append('detail', data.detail);
  formData.append('budget_min', data.budgetMin);
  formData.append('budget_max', data.budgetMax);
  formData.append('image_file', data.image);
  formData.append('tag', data.tag_id);
  formData.append('user_id', 1);

  console.log('formData: ', formData);

  return media_upload.put(`/project_post/${data.id}`, formData);
};

const getAllProjects = (user_id) => {
  console.log('user_id: ', user_id);
  return http.get(`/project_post/findAll/${user_id}`);
};

const getProjectbyId = (id) => {
  return http.get(`/project_post/${id}`);
};

const findProjPostsByPage = (page, size, searchKey, access_token) => {
  console.log("findProjPostsByPage: ", page, size, searchKey);
  return http.get(`/project_post/getprojposts/${page}&${size}&${searchKey}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const changeStatusByID = (id, status, access_token) => {
  return http.put(`/project_post/status/${id}&${status}`,{headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const removePostById = (id, access_token) => {
  console.log("removeUserByAccName: ", id);
  return http.delete(`/project_post/deleteprojpost/${id}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const findAndChangeStatusByUserID = (user_id, status) => {
  return http.put("/project_post/findAndChangeStatus/" + user_id + "&" + status);
};

const projectPostServices = {
  sendProject,
  getAllProjects,
  getProjectbyId,
  updateProject,
  findOnebyId,
  findProjPostsByPage,
  changeStatusByID,
  removePostById,
  findAndChangeStatusByUserID,
};

export default projectPostServices;
