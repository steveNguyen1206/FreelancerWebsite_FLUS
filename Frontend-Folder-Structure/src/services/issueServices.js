import { http } from "./http-common";

const getAllIssue = () => {
  return http.post("/issue/");
};

const findIssuesByPage = (page, size, searchKey) => {
    console.log("findIssuesByPage: ", page, size, searchKey);
    return http.get(`/issue/getissues/${page}&${size}&${searchKey}`);
  };

const issueServices = {
    getAllIssue,
    findIssuesByPage,
};

export default issueServices;
