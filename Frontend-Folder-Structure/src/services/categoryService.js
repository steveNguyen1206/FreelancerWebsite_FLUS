import { media_upload, http } from "./http-common";

// const create = (data) => {
//     return http.post("/category", data);
// };

const create = async (data) => {
  let formData = new FormData();

  formData.append('name', data.name)
  formData.append('img', data.img); // này để lấy file ảnh
  
  return media_upload.post("/category", formData);
};

const findAll = () => {
  return http.get("/category");
};

// findOnebyId
const findOne = id => {
  return http.get(`/category/${id}`);
};

const update = (data) => {
  return http.put(`/category`, data);
};

const deleteCategory = id => {
  return http.delete(`/category/${id}`);
};

const findAllwithSubcate = (searchKey) => {
  return http.get(`/category/all/${searchKey}`);
}

const categoryService = {
    create,
    findAll,
    findOne,
    update,
    deleteCategory,
    findAllwithSubcate,
};

export default categoryService;
