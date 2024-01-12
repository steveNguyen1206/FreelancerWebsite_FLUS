import http from "./http-common";

const findAndChangeStatusByUserID = (user_id, status) => {
    return http.put("/freelancer_post/findAndChangeStatus/" + user_id + "&" + status);
};

const freelancerPostService = {
    findAndChangeStatusByUserID,
};
  
  export default freelancerPostService;
  