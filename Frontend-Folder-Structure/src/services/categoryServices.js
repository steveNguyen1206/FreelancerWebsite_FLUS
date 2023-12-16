import http from "./http-common";

const getNamefromId = (id) => {
    return http.get(`/subcategory/get_name/${id}`);
    }

const categoryServices = {
    getNamefromId,
};

export default categoryServices;