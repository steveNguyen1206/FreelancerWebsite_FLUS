import { http } from "./http-common";

const create = (data) => {
    return http.post("/comment", data);
};

const findAll = () => {
    return http.get("/comment");
    }

const findOne = id => {
    return http.get(`/comment/${id}`);
    }

const findCommentByProjectId = project_id => {
    return http.get(`/comment/findCommentByProjectId/${project_id}`);
    }



export const commentService = {
    create,
    findAll,
    findOne,
    findCommentByProjectId,
};



export default commentService;
