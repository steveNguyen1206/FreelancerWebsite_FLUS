import http from "./http-common";


const findMemberOnebyId = (id, access_token) => {
  console.log("api call id", id)
    return http.get(`/project/mem/${id}`,  {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

// const createProject = (access_token) => {
  const createProject = (data) => {
  return http.post("/project",  data);
}

const getAllProject = () => {
  return http.get("/project/all");
};

const updateProjectNotNull = (id, data) => {
  return http.put(`/project/updateNotNull/${id}`, data);
}

const configureProject = (id, access_token, data) => {
  console.log(access_token);
  return http.put(`/project/${id}`, data,  {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}

const findOwnerOnebyId = (id, access_token) => {
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
  
  const getProjectReport = (projectId, reportId,  access_token) => {
    return http.get(`project-report/get-one/${projectId}/${reportId}`, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  };

  const getNewestProjectReport = (projectId, access_token) => {
    console.log("proId", projectId)
    return http.get(`project-report/newest/${projectId}`, {headers: {
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

  const updateReport = (projectId, data, access_token) => {
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

  const getAllOwnProjects = (access_token) => {
    return http.get(`project/all-own`, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  }

  const getAllMemberProjects = (access_token) => {
    return http.get(`project/all-mem`, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
  }



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
    getNewestProjectReport,
    getAllOwnProjects,
    getAllMemberProjects,
    createNull,
    getAllProject,
    updateProjectNotNull
  };

  export default projectService;