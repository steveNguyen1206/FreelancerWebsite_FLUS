import http from './http-common';

const create = (projectPostId, access_token) => {
  return http.post(`/wishlist/${projectPostId}`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const remove = (projectPostId, access_token) => {
  return http.delete(`/wishlist/${projectPostId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const getWishlistByUserId = (access_token) => {
  return http.get(`/wishlist/get_wishlist/`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const isExisted = (projectPostId, access_token) => {
  return http.get(`/wishlist/is_existed/${projectPostId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

export default {
  create,
  remove,
  getWishlistByUserId,
  isExisted,
};
