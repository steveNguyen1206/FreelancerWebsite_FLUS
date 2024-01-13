import http from "./http-common";

const create = (data) => {
    const access_token = localStorage.getItem('AUTH_TOKEN');

    console.log("======== ADD A TAG TO A USER =========");
    return http.post("/user_subcategory", data, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
};

const findAll = (id) => {
    console.log("======== GET ALL TAGS OF A USER =========" + id);
    return http.get(`/user_subcategory/${id}`);
};

const deleteSubcategory = (data) => {
    const access_token = localStorage.getItem('AUTH_TOKEN');

    console.log("DELETE SUBCATEGORY OF A USER");
    console.log("data", data);
    const id = data.userId;
    const subcategoryId = data.subcategoryId;
    
    return http.delete(`/user_subcategory/${id}/${subcategoryId}`, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
      }});
};

const userSubcategoryService = {
    create,
    findAll,
    deleteSubcategory,
};

export default userSubcategoryService;
