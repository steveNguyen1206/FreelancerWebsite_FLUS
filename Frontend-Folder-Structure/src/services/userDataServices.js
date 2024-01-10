import { media_upload, http } from "./http-common";

const findAll = () => {
  return http.get("/user");
};

// findOnebyId
const findOnebyId = id => {
  return http.get(`/user/${id}`);
};

const signup = data => {
  return http.post("/auth/signup", data);
};

const signin = data => {
  return http.post("/auth/signin", data);
};

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

const findUsersbyPage = (page, size, searchKey) => {
  console.log("findUsersbyPage: ", page, size, searchKey);
  return http.get(`/user/getusers/${page}&${size}&${searchKey}`);
};

const removeUserByAccName = (accountName) => {
  console.log("removeUserByAccName: ", accountName);
  return http.delete(`/user/deleteuser/${accountName}`);
};


const changeStatusByID = (id, status) => {
  return http.put(`/user/status/${id}&${status}`);
};

const changePassword = (data) => {
  return http.put(`/user/change_password`, data);
};

const updateNameAndSocialLink = (data) => {
  return http.put(`/user/update_name_sociallink`, data);
};

const updateAvatar = (user_id, selectedFile) => {
  const formData = new FormData();
  formData.append('avatar', selectedFile);
  console.log(selectedFile);

  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  return media_upload.put(`/user/avatar/${user_id}`, formData);
}

const userDataService = {
  findAll,
  findOnebyId,
  signup,
  signin,
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



