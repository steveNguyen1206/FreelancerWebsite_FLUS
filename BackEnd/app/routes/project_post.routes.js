module.exports = (app) => {
    const projectPostController = require("../controllers/project_post.controller.js");

    var router = require("express").Router();

    // Create a new Project_post
    router.post("/create", projectPostController.createProjectPost);

    // Retrieve all Project_posts (belongs to a user) from the database
    router.get("/findAll/:userId", projectPostController.findAllProjectPosts);
    
    // change status of many project_posts by list of project_post_id
    router.put("/changeStatus", projectPostController.changeStatus);

    // Find and change status of project_posts by some criteria
    router.put("/findAndChangeStatus/:userId&:status", projectPostController.findAndChangeStatus);

    // Retrieve all Project_posts from the database
    router.get("/findAll", projectPostController.findAllProjectPosts);

    // get owner project `/project_post/owner/${id}`
    router.get("/owner/:id", projectPostController.findOwnerProject);

    // `/project_post/${id}`
    router.get("/:id", projectPostController.findOne);

    // /project_post/update
    router.post("/update", projectPostController.update);

    app.use("/api/project_post", router);
}