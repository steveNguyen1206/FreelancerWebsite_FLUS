const { verifyToken } = require("../middleware/authJwt.js");

module.exports = (app) => {
  const comment = require("../controllers/comment.controller.js");
  let router = require("express").Router();

  // Create a new Comment
  router.post("/", [verifyToken], comment.create);

  // Retrieve all Comments by Project ID
  router.get(
    "/findCommentByProjectId/:project_id",
    comment.findCommentByProjectId
  );

  router.post("/findAndChangeStatusByUserID/:user_id&:status", comment.findAndChangeStatusByUserID);

  app.use("/api/comment", router);
};
