import { media_upload, http } from "./http-common";

const allposts = (freelancer_id) => {
  console.log("allposts");
  return http.get(`/freelancer_post/allposts/${freelancer_id}`);
}

const allAllPosts = (freelancer_id) =>{
    console.log("allposts");
    return http.get(`/freelancer_post/allallposts`);
}

const findOnebyId = id => {
  return http.get(`/freelancer_post/${id}`);
};

const sendPost = async (data) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');
  console.log("access_token", access_token)
  let formData = new FormData();
  formData.append('title', data.title)
  formData.append('image_file', data.image_file); // này để lấy file ảnh
  console.log("data.about_me", data.about_me);
  formData.append('freelancer_id', data.freelancer_id);
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

  return media_upload.post("/freelancer_post", formData, {
    headers: {
      "Content-type": 'multipart/form-data',
      "x-access-token": access_token,
    },
  });
};


const updatePost = async (data) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');

  let formData = new FormData();
  console.log("data.id");
  console.log("data.id", data.id);
  formData.append('title', data.title)
  formData.append('image_file', data.image_file); // này để lấy file ảnh
  formData.append('freelancer_id', data.freelancer_id);
  formData.append('about_me', data.about_me);
  formData.append('skill_description', data.skill_description);
  formData.append('lowset_price', data.lowset_price);
  formData.append('delivery_due', data.delivery_due);
  formData.append('revision_number', data.revision_number);
  formData.append('delivery_description', data.delivery_desciption);
  formData.append('skill_tag', data.skill_tag);

  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  return media_upload.put(`/freelancer_post/${data.id}`, formData, {
    headers: {
      "Content-type": 'multipart/form-data',
      "x-access-token": access_token,
    },
  });
};


const findFreelancerEmail = id => {
  return http.get(`/freelancer_post/email/${id}`);
}
const findFreePostsByPage = (page, size, searchKey) => {
  console.log("findFreePostsByPage: ", page, size, searchKey);
  return http.get(`/freelancer_post/getfreeposts/${page}&${size}&${searchKey}`);
};


const changeStatusByID = (id, status) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');

  return http.put(`/freelancer_post/status/${id}&${status}`, {
    headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    },
  });
};

const removePostById = (id) => {
  console.log("removeUserByAccName: ", id);
  return http.delete(`/freelancer_post/deletefreepost/${id}`);
};

const freelancer_post_Service = {
  // create,
  // update,
  allposts,
  allAllPosts,
  sendPost,
  updatePost,
  findOnebyId,
  findFreelancerEmail,
  findFreePostsByPage,
  changeStatusByID,
  removePostById,
};

export default freelancer_post_Service;