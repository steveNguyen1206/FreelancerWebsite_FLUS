import { http } from "./http-common";

const getNamefromId = (id) => {
    console.log(id, "id");
    return http.get(`/subcategory/get_name/${id}`);
}

const categoryServices = {
    getNamefromId,
};

export default categoryServices;