import http from "./http-common";


const findMemberOnebyId = (id, access_token) => {
  console.log("api call id", id)
    return http.get(`/project/${id}`,  {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

// const createProject = (access_token, data) => {
//   return http.post(`/project`, data, {headers: {
//     "Content-type": "application/json",
//     "x-access-token": access_token,
//   }});
// }

const createProject = (data) => {
  return http.post(`/project`, data);
}

const configureProject = (id, access_token, data) => {
  console.log(access_token);
  return http.put(`/project/${id}`, data,  {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}

const findOwnerOnebyId = (id, access_token) => {
  console.log("api call id", id)
    return http.get(`project/own/${id}`,  {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };


  const createProjectReport = (projectId, access_token, data) => {
    return http.post(`project-report/${projectId}`, data, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };
  
  const getProjectReport = (projectId, access_token) => {
    return http.get(`project-report/${projectId}`, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

  const acceptReport = (projectId, access_token) => {
    // console.log(access_token);
    console.log(projectId);
    return http.put(`project-report/accept/${projectId}`, {}, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

  const updateReport = (projectId, access_token, data) => {
    return http.put(`project-report/update/${projectId}`, data, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

  const getALlNotifications = (projectId, access_token) => {
    console.log(projectId);
    return http.get(`project-notis/${projectId}`, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  }

  const createNull = () => {
    return http.post("/project/createNull");
  };

  const projectService = {
    findMemberOnebyId,
    findOwnerOnebyId,
    createProject,
    configureProject,
    createProjectReport,
    getProjectReport,
    acceptReport,
    updateReport,
    getALlNotifications,
    createNull
  };

  export default projectService;