import { http } from "./http-common";

const create = (data, access_token) => {
    return http.post("/subcategory", data, {headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    }});
};

const findAll = () => {
  return http.get("/subcategory");
};

// findOnebyId
const findOne = id => {
  return http.get(`/subcategory/${id}`);
};

const update = (data, access_token) => {
  return http.put(`/subcategory/`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const deleteSubcategory = (id, access_token) => {
  return http.delete(`/subcategory/${id}`, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};

const subcategoryService = {
    create,
    findAll,
    findOne,
    update,
    deleteSubcategory,
};

export default subcategoryService;
