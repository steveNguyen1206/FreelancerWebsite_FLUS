import http from "./http-common";

const getRatingClient = (id) => {
    return http.get(`/review/get_rating_client/${id}`);
    };



const reviewService = {
    getRatingClient,
};

export default reviewService;