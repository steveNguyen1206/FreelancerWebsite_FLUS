module.exports = (app) => {
    const comment = require("../controllers/comment.controller.js");
    let router = require("express").Router();

    // Create a new Comment
    router.post("/", comment.create);

    // Retrieve all Comments
    router.get("/", comment.findAll);

    // Retrieve a single Comment with id
    router.get("/:id", comment.findOne);

    // Retrieve all Comments by Project ID
    router.get("/findCommentByProjectId/:project_id", comment.findCommentByProjectId);

    app.use("/api/comment", router);
  };