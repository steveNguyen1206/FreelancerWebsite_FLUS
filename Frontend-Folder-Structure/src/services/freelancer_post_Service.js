import { media_upload, http } from "./http-common";

const allposts = (freelancer_id) => {
  console.log("allposts");
  return http.get(`/freelancer_post/allposts/${freelancer_id}`);
}

const findOnebyId = id => {
    return http.get(`/freelancer_post/${id}`);
};


// const create = data => {
//     return http.post("/freelancer_post", data);
// }

const update = (data) => {
    return http.put(`/freelancer_post`, data);
}


const sendPost = async (data) => {
    let formData = new FormData();
    // const userId = 1;
    // console.log(data);
    formData.append('title', data.title)
    formData.append('image_file', data.image_file); // này để lấy file ảnh
    console.log("data.about_me", data.about_me);
    formData.append('freelancer_id', "1");
    formData.append('about_me', data.about_me);
    formData.append('skill_description', data.skill_description);
    formData.append('lowset_price', data.lowset_price);
    formData.append('delivery_due', data.delivery_due);
    formData.append('revision_number', data.revision_number);
    formData.append('delivery_description', data.delivery_description);
    // formData.append('imgage_post_urls', "");
    formData.append('skill_tag', data.skill_tag);

    console.log(formData);
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
    
    return media_upload.post("/freelancer_post", formData);
  };


  const updatePost = async (data) => {
    let formData = new FormData();
    // formData.append("freelancer_id", data.id);
    formData.append('title', data.title)
    formData.append('image_file', data.image_file); // này để lấy file ảnh
    console.log("data.about_me", data.about_me);
    formData.append('freelancer_id', "1");
    formData.append('about_me', data.about_me);
    formData.append('skill_description', data.skill_description);
    formData.append('lowset_price', data.lowset_price);
    formData.append('delivery_due', data.delivery_due);
    formData.append('revision_number', data.revision_number);
    formData.append('delivery_description', data.delivery_desciption);
    // formData.append('imgage_post_urls', "");
    formData.append('skill_tag', data.skill_tag);

    try {
      const response = await http.put('/freelancer_post', formData, {
        headers: {
          ...http.defaults.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log('Error submitting project:', error);
    }
    
    return http.put("/freelancer_post", formData);
  };


const findFreelancerEmail = id => {
    return http.get(`/freelancer_post/email/${id}`);
}
const findFreePostsByPage = (page, size, searchKey, access_token) => {
  console.log("findFreePostsByPage: ", page, size, searchKey);
  return http.get(`/freelancer_post/getfreeposts/${page}&${size}&${searchKey}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};


const changeStatusByID = (id, status, access_token) => {
  return http.put(`/freelancer_post/status/${id}&${status}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const removePostById = (id, access_token) => {
  console.log("removeUserByAccName: ", id);
  return http.delete(`/freelancer_post/deletefreepost/${id}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const freelancer_post_Service = {
    // create,
    update,
    allposts,
    sendPost,
    updatePost,
    findOnebyId,
    findFreelancerEmail,
    findFreePostsByPage,
    changeStatusByID,
    removePostById,
};

export default freelancer_post_Service;