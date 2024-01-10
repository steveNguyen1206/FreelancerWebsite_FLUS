import { media_upload, http } from "./http-common";

const create = async (data, access_token) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('detail', data.detail);
    formData.append('budget_min', data.budgetMin);
    formData.append('budget_max', data.budgetMax);
    formData.append('tag_id', data.tag_id); 
    formData.append('image_file', data.image);
    formData.append('start_date', data.startDate);

    console.log("formData: ", formData);
    return media_upload.post("/project_post/", formData,
    {headers: {
      'Content-Type': 'multipart/form-data',
      "x-access-token": access_token,
    }});
  };

const update = async (data, access_token) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('detail', data.detail);
    formData.append('budget_min', data.budgetMin);
    formData.append('budget_max', data.budgetMax);
    formData.append('image_file', data.image);
    formData.append('tag', data.tag_id);
    formData.append('start_date', data.startDate);

    console.log("formData: ", formData);
    
  return media_upload.put(`/project_post/${data.id}`, formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
      "x-access-token": access_token,
}});
  };


const getAll = () => {
    return http.get("/project_post/findAll");
};

const getOnebyId = (id) => {
    return http.get(`/project_post/findOne/${id}`);
}

const changeStatus = (id, status, access_token) => {
    return http.put(`/project_post/changeStatus/${id}/${status}`,
    {
      headers:{
        "Content-Type": "application/json",
        "x-access-token": access_token,
      }
    });
}



const projectPostServices= {
    create,
    update,
    getAll,
    getOnebyId,
    changeStatus,
};



export default projectPostServices;