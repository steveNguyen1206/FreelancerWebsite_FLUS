const {upload } = require("../middleware");
const {verifyToken} = require('../middleware/authJwt.js');
const {isOwnerProjectPost} = require('../middleware/project_post.middleware.js')
module.exports = (app) => {
    const projectPostController = require("../controllers/project_post.controller.js");

    var router = require("express").Router();
    
    // create
    router.post("/",upload.single("image_file"),[verifyToken], projectPostController.create);

     // update
     router.put("/:project_post_id",upload.single("image_file"),[verifyToken, isOwnerProjectPost],  projectPostController.update);

    // Retrieve a single Project_post with id
    router.get("/findOne/:id",projectPostController.findOne);

    // Change status of project_post
    router.put("/changeStatus/:project_post_id/:status",[verifyToken, isOwner], projectPostController.changeStatus);

    // Retrieve all Project_posts from the database
    router.get("/findAll",  projectPostController.findAllProjectPosts);
   
    app.use("/api/project_post", router);
}