import http from "./http-common";

const create = (data) => {
    console.log("======== ADD A TAG TO A USER =========");
    return http.post("/user_subcategory", data);
};

const findAll = (id) => {
    console.log("======== GET ALL TAGS OF A USER =========" + id);
    return http.get(`/user_subcategory/${id}`);
};

const deleteSubcategory = (data) => {
    console.log("DELETE SUBCATEGORY OF A USER");
    console.log("data", data);
    const userId = data.userId;
    const subcategoryId = data.subcategoryId;
    
    return http.delete(`/user_subcategory/${userId}/${subcategoryId}`, data);
};

const userSubcategoryService = {
    create,
    findAll,
    deleteSubcategory,
};

export default userSubcategoryService;
