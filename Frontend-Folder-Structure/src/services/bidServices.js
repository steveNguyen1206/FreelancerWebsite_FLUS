import http from './http-common';

const bidProject = (data, access_token) => {
  const post_id = Number(data.proj_post_id);
  const skill = Number(data.skill);
  const req = {
    price: data.price,
    message: data.message,
    duration: data.duration,
    email: data.email,
    status: 0,
    skill_id: skill,
    proj_post_id: post_id,
  };

  console.log('req: ', req);

  return http.post('/bid/', req, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const findBidByProjectPostId = (project_id, access_token) => {
  return http.get('/bid/findBidByProjectId/' + project_id, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const acceptBid = (bid_id, access_token) => {
  return http.put('/bid/acceptBid/' + bid_id,{}, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const rejectBid = (bid_id, access_token) => {
  return http.put('/bid/rejectBid/' + bid_id,{}, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const getNumOfBid = (project_id, access_token) => {
  return http.get('/bid/getNumOfBid/' + project_id, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};


const changeOtherBidStatus = (bid_id, status, access_token) => {
  return http.put('/bid/changeOtherBidStatus/' + bid_id + '/' + status, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const getProjectPostfromBid = (bid_id, access_token) => {
  return http.get('/bid/getProjectPostfromBid/' + bid_id, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': access_token,
    },
  });
};

const bidService = {
  bidProject,
  findBidByProjectPostId,
  acceptBid,
  rejectBid,
  getNumOfBid,
  changeOtherBidStatus,
  getProjectPostfromBid,
};

export default bidService;
