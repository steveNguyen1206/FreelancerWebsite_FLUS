<<<<<<< HEAD
import http from "./http-common";


const findOnebyId = id => {
    return http.get(`/project_post/${id}`);
  };

  
const sendProject = async (data) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('detail', data.detail);
    formData.append('budget_min', data.budgetMin);
    formData.append('budget_max', data.budgetMax);
    formData.append('imgage_post_urls', "");
    formData.append('tag', data.tag);
    formData.append('user_id', 1);

    console.log(formData);
  
    try {
      const response = await http.post('/project_post/create', formData, {
        headers: {
          ...http.defaults.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log('Error submitting project:', error);
    }
    
    return http.post("/project_post/create", formData);
  };


const updateProject = async (data) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('detail', data.detail);
    formData.append('budget_min', data.budgetMin);
    formData.append('budget_max', data.budgetMax);
    formData.append('image', data.image);
    formData.append('tag_id', data.tag);
    formData.append("user_id", data.id);


    try {
      const response = await http.post('/project_post/update', formData, {
        headers: {
          ...http.defaults.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log('Error submitting project:', error);
    }
    
    return http.post("/project_post/update", formData);
  };


const getAllProjects = () => {
    return http.get("/project_post/findAll");
};

const getProjectbyId = id => {
    return http.get(`/project_post/${id}`);
}

const projectServices= {
    sendProject,
    getAllProjects,
    getProjectbyId,
    updateProject,
    findOnebyId,
};

export default projectServices;
=======
import http from "../http-common";

const findAndChangeStatus = (user_id, status) => {
    return http.get("/project_post/findAndChangeStatus/" + user_id + "&" + status);
};

const projectPostService = {
    findAndChangeStatus,
};
  
export default projectPostService;
  
>>>>>>> 49d05c152067e400f63a9c8ebc6e13b6cbf397e2
