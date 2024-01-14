import http from "./http-common";

const findAndChangeStatusByUserID = (user_id, status) => {
    return http.put("/freelancer_post/findAndChangeStatus/" + user_id + "&" + status);
};

const filterOnCategory = (category_id) => {
    return http.get("/freelancer_post/getPostByCategory/" + category_id);
};

const freelancerPostService = {
    findAndChangeStatusByUserID,
    filterOnCategory
};
  
  export default freelancerPostService;
  