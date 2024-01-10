import http from "./http-common";

const getRatingClient = (id) => {
    return http.get(`/review/get_rating_client/${id}`);
    };

const getRatingFreelancer = (id) => {
    return http.get(`/review/get_rating_freelancer/${id}`);
    }




const reviewService = {
    getRatingClient,
    getRatingFreelancer,
};

export default reviewService;