const { upload } = require("../middleware");
const user_controller = require("../controllers/user.controller.js");
const {verifyToken, isAdmin} = require('../middleware/authJwt.js')
const {isOwner} = require('../middleware/profile.middleware.js')


module.exports = (app) => {
  var router = require("express").Router();

  // Retrieve all Users
  router.get("/", user_controller.findAll);

  // Retrieve a single User with id
  router.get("/:id", user_controller.findOnebyId);

  // Retrieve a single User with account_name
  router.get("/account_name/:account_name", user_controller.findOnebyAccountName);
  
  // Retrieve a single User with email
  router.get("/email/:email", user_controller.findOnebyEmail);

  // Route to get users by page and size
  router.get('/getusers/:page&:size&:searchKey', [verifyToken, isAdmin], user_controller.findUsersbyPage);
  router.get('/getusers/:page&:size', [verifyToken, isAdmin], user_controller.findUsersbyPage);

  // Update avatar of a user
  router.put("/avatar/:id", [verifyToken, isOwner], upload.single("avatar"), user_controller.updateAvatar);

  // Delete a User with account_name
  router.delete("/deleteuser/:accountName",[verifyToken, isAdmin], user_controller.deleteOnebyAccountName);
  
  // Delete a User with reportedTimes
  // router.delete("/reported_times", user_controller.deleteOnebyReportedTimes);
  
  // Update the status of a User by id and status param
  router.put("/status/:id&:status", [verifyToken, isAdmin], user_controller.changeStatusByID);
  
  // Change password of a User by id
  router.put("/change_password", [verifyToken, isOwner], user_controller.changePassword);

  // update name and social link of a User by id
  router.put("/update_name_sociallink", [verifyToken, isOwner], user_controller.updateNameAndSocialLink);

  // Update a User with id
  router.put("/:id", [verifyToken, isOwner], user_controller.update);
  
  app.use("/api/user", router);
};