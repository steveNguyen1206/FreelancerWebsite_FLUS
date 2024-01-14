const issue_controller = require("../controllers/issue.controller.js");
const { verifyToken, isAdmin } = require("../middleware/authJwt.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Retrieve all Users
  router.get("/", issue_controller.getAllIssues);

   // Route to get issue by page and size
   router.get('/getissues/:page&:size&:searchKey', issue_controller.findIssuesByPage);
   router.get('/getissues/:page&:size', issue_controller.findIssuesByPage);
  router.put('/reject/:issueId', [verifyToken, isAdmin], issue_controller.rejectIssue);

  
  app.use("/api/issue", router);
};
