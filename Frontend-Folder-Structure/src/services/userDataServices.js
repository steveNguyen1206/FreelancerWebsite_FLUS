import { media_upload, http } from "./http-common";

const findAll = () => {
  return http.get("/user", );
};

// findOnebyId
const findOnebyId = id => {
  return http.get(`/user/${id}`);
};

// const signup = data => {
//   return http.post("/auth/signup", data);
// };

// const signin = data => {
//   return http.post("/auth/signin", data);
// };

const update = (id, data) => {
  return http.put(`/user/${id}`, data);
};

// const updateAvatar = (id, avatarFile) => {
//   const formData = new FormData();
//   formData.append('avatar', avatarFile);
//   console.log(avatarFile);
//   return media_upload.put(`/user/avatar/${id}`, formData);
// };



// const removeAll = () => {
//   return http.delete(`/user`);
// };

// const findByTitle = title => {
//   return http.get(`/user?title=${title}`);
// };

const findOnebyAccountName = account_name => {
  return http.get(`/user/account_name/${account_name}`);
};

const findOnebyEmail = email => {
  return http.get(`/user/email/${email}`);
};

const findUsersbyPage = (page, size, searchKey, access_token) => {
  console.log("findUsersbyPage: ", page, size, searchKey);
  return http.get(`/user/getusers/${page}&${size}&${searchKey}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const removeUserByAccName = (accountName, access_token) => {
  console.log("removeUserByAccName: ", accountName);
  return http.delete(`/user/deleteuser/${accountName}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};


const changeStatusByID = (id, status, access_token) => {
  console.log("changeStatusByID: ", id, status, access_token);
  
  const data = {
    useridtochange: id,
    status: status
  };

  return http.put(`/user/status/${id}&${status}`, data, {
    headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    },
  });
};

const changePassword = (data) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');
  return http.put(`/user/change_password`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const updateNameAndSocialLink = (data) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');

  return http.put(`/user/update_name_sociallink`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const updateAvatar = (user_id, selectedFile) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');

  const formData = new FormData();
  formData.append('avatar', selectedFile);
  console.log(selectedFile);

  return media_upload.put(`/user/avatar/${user_id}`, formData, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}

const userDataService = {
  findAll,
  findOnebyId,
  // signup,
  // signin,
  update,
  findOnebyAccountName,
  findOnebyEmail,
  findUsersbyPage,
  removeUserByAccName,
  changeStatusByID, // Add the new service function here
  changePassword,
  updateNameAndSocialLink,
  updateAvatar
};


export default userDataService;



