const { upload } = require("../middleware");
const { verifyToken } = require("../middleware/authJwt.js");
const {
  isOwnerProjectPost,
  isExpiredProjectPost,
} = require("../middleware/project_post.middleware.js");
module.exports = (app) => {
  const projectPostController = require("../controllers/project_post.controller.js");

  var router = require("express").Router();

  // create
  router.post(
    "/",
    upload.single("image_file"),
    [verifyToken],
    projectPostController.create
  );

  // update
  router.put(
    "/:project_post_id",
    upload.single("image_file"),
    [verifyToken, isOwnerProjectPost],
    projectPostController.update
  );

  // Retrieve a single Project_post with id
  router.get("/findOne/:id", projectPostController.findOne);

  // Retrieve all Project_posts (belongs to a user) from the database
  router.get(
    "/findAllByUserId/:user_id",
    [isExpiredProjectPost],
    projectPostController.findAllProjectPostsbyUserID
  );

  // change status of many project_posts by list of project_post_id
  router.put("/changeStatus", projectPostController.changeStatus);

  // Change status of project_post
  router.put(
    "/changeStatus/:project_post_id/:status",
    [verifyToken, isOwner],
    projectPostController.changeStatus
  );

  // Retrieve all Project_posts from the database
  router.get(
    "/findAllProjectPosts",
    [isExpiredProjectPost],
    projectPostController.findAll
  );

  // get owner project `/project_post/owner/${id}`
  router.get("/owner/:id", projectPostController.findOwnerProject);

  // /project_post/update
  router.put("/:id", upload.single("image_file"), projectPostController.update);

  // Route to get project_post by page and size
  router.get(
    "/getprojposts/:page&:size&:searchKey",
    [verifyToken, isAdmin],
    projectPostController.findProjPostsByPage
  );
  router.get(
    "/getprojposts/:page&:size",
    [verifyToken, isAdmin],
    projectPostController.findProjPostsByPage
  );

  // Update the status of a Projpost by id and status param
  router.put(
    "/status/:id&:status",
    [verifyToken, isAdmin],
    projectPostController.changeStatusByID
  );

  // Delete a Projpost with id
  router.delete(
    "/deleteprojpost/:id",
    [verifyToken, isAdmin],
    projectPostController.deleteById
  );

  app.use("/api/project_post", router);
};
