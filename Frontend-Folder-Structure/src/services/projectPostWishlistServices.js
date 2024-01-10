import http from "./http-common";

const create = (userId, projectPostId) => {
    return http.post(`/wishlist/${userId}/${projectPostId}`);
}


const remove = (userId, projectPostId) => {
    return http.delete(`/wishlist/${userId}/${projectPostId}`);
}

const getWishlistByUserId = (userId) => {
    console.log(userId);
    return http.get(`/wishlist/get_wishlist/${userId}`);
}

const isExisted = (userId, projectPostId) => {
    return http.get(`/wishlist/is_existed/${userId}/${projectPostId}`);
}

export default {
    create,
    remove,
    getWishlistByUserId,
    isExisted,
};
