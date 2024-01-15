const {verifyToken} = require('../middleware/authJwt.js');
const {isOwnerWishlist} = require("../middleware/wishlist.middleware.js")
module.exports = (app) => {
    const wishlist = require("../controllers/wishlist.controller.js");
    let router = require("express").Router();
  
    // Create a new wishlist
    router.post("/:projectPostId", [verifyToken], wishlist.create);
  
    // Delete a Wishlist
    router.delete("/:projectPostId", [verifyToken, isOwnerWishlist], wishlist.delete);

    // get all wishlist of a user
    router.get("/get_wishlist",[verifyToken], wishlist.findAllWishlistByUserId);

    // check is existed in wishlist
    router.get("/is_existed/:projectPostId", [verifyToken], wishlist.isExisted);
  
    // use /api/wishlist
    app.use("/api/wishlist", router);
  };