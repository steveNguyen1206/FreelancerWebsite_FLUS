const { authJwt, upload } = require("../middleware");
module.exports = (app) => {
  const projectPostController = require("../controllers/project_post.controller.js");

  var router = require("express").Router();

  // Create a new Project_post
  router.post("/", upload.single("image_file"), projectPostController.create);

  // Retrieve all Project_posts (belongs to a user) from the database
  router.get("/findAll/:user_id", projectPostController.findAllProjectPosts);
  router.get("/findAll/", projectPostController.findAllProjectPosts);

  // change status of many project_posts by list of project_post_id
  router.put("/changeStatus", projectPostController.changeStatus);

  // Find and change status of project_posts by some criteria
  router.put(
    "/findAndChangeStatus/:userId&:status",
    projectPostController.findAndChangeStatus
  );

  // Retrieve all Project_posts from the database
  router.get("/findAll", projectPostController.findAllProjectPosts);

  // get owner project `/project_post/owner/${id}`
  router.get("/owner/:id", projectPostController.findOwnerProject);

  // `/project_post/${id}`
  router.get("/:id", projectPostController.findOne);

  // /project_post/update
  router.put("/:id", upload.single("image_file"), projectPostController.update);

  // Route to get project_post by page and size
  router.get('/getprojposts/:page&:size&:searchKey', projectPostController.findProjPostsByPage);
  router.get('/getprojposts/:page&:size', projectPostController.findProjPostsByPage);

  // Update the status of a Projpost by id and status param
  router.put("/status/:id&:status", projectPostController.changeStatusByID);

  // Delete a Projpost with id
  router.delete("/deleteprojpost/:id", projectPostController.deleteById);

  app.use("/api/project_post", router);
};
