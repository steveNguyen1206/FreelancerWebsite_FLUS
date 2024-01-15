import { http } from "./http-common";

const getAllIssue = () => {
  return http.post("/issue/");
};

const findIssuesByPage = (page, size, searchKey) => {
    console.log("findIssuesByPage: ", page, size, searchKey);
    return http.get(`/issue/getissues/${page}&${size}&${searchKey}`);
  };

const rejectIssue = (issueId, data, access_token) => {
  return http.put(`/issue/reject/${issueId}`, data, {
    headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    },
  });
};
const issueServices = {
    getAllIssue,
    findIssuesByPage,
    rejectIssue
};

export default issueServices;
