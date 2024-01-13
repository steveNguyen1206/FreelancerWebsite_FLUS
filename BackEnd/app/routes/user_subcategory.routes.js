const {verifyToken} = require('../middleware/authJwt.js')
const {isOwner} = require('../middleware/profile.middleware.js')

module.exports = app => {
    const user_subcategory = require("../controllers/user_subcategory.controller.js");
  
    var router = require("express").Router();
  
    // add a subcategory to a user by user id and subcategory id
    router.post("/", [verifyToken, isOwner], user_subcategory.create);

    // retrieve all subcategory of a user by user id
    router.get("/:id", user_subcategory.findAll);
  
    // delete a subcategory of a user by user id and subcategory id
    router.delete("/:id/:subcategoryId", [verifyToken, isOwner], user_subcategory.delete);

    app.use('/api/user_subcategory', router);
  };
  