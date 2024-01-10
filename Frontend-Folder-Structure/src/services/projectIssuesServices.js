import http from "./http-common";

const createProjectIssues= (projectId, access_token, data) => {
    return http.post(`/issues/${projectId}`, data, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
    };

const updateProjectIssues = (projectId, access_token, data) => {
    return http.put(`/issues/${projectId}`, data, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
    };

const getAllProjectIssues = (projectId, access_token) => {
    return http.get(`/issues/find-all/${projectId}`, {}, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
    };

const getProjectIssuesbyId = (projectId, access_token, id) => {    
    return http.get(`/issues/find-one/${projectId}/${id}`, {}, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
    };
const projectIssuesServices = {
    createProjectIssues,
    getAllProjectIssues,
    getProjectIssuesbyId,
    updateProjectIssues
};

export default projectIssuesServices;