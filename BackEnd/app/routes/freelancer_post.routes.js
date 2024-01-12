const { authJwt, upload } = require("../middleware");
module.exports = app => {
    const freelancer_post = require("../controllers/freelancer_post.controller.js");
  
    var router = require("express").Router();
  
    // Create a new freelancer_post
    router.post("/", upload.single("image_file"), freelancer_post.create);
  
    // Retrieve all freelancer_post
    router.get("/", freelancer_post.findAll);

    router.get("/allposts/:freelancer_id", freelancer_post.findAllPosts);
    router.get("/allposts/", freelancer_post.findAllPosts);
  
    // // Retrieve all published Category
    // router.get("/published", category.findAllPublished);
  
    // Retrieve a single freelancer_post with id
    router.get("/:id", freelancer_post.findOne);

    router.get("/email/:id", freelancer_post.getFreelancerEmail);
  
    // Update a freelancer_post with id
    router.put("/update", freelancer_post.update);
  
    // // Delete a Category with id
    // router.delete("/:id", freelancer_post.delete);
  
    // // Delete all freelancer_post
    // router.delete("/", category.deleteAll);

    // Route to get project_post by page and size
    router.get('/getfreeposts/:page&:size&:searchKey', freelancer_post.findFreePostsByPage);
    router.get('/getfreeposts/:page&:size', freelancer_post.findFreePostsByPage);
  
    
    // Update the status of a Projpost by id and status param
    router.put("/status/:id&:status", freelancer_post.changeStatusByID);

    // Delete a Projpost with id
    router.delete("/deletefreepost/:id", freelancer_post.deleteById);

    //Update post status by user id
    router.put("/findAndChangeStatus/:userId&:status", freelancer_post.findAndChangeStatus);

    app.use('/api/freelancer_post', router);
  };
  