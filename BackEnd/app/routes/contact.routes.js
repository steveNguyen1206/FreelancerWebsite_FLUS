const { authJwt, upload } = require("../middleware");
const {verifyToken} = require('../middleware/authJwt.js')
const {isOwnerContact, isUser} = require('../middleware/contact.middleware.js')

module.exports = app => {
    const contact = require("../controllers/contact.controller.js");
    
    var router = require("express").Router();
    
    // Create a new Category
    // router.post("/", contact.create);
    // Tạo contact mới có access_token
    router.post("/",[verifyToken], contact.create)

    // Retrieve all Category
    router.get("/", contact.findAll);

    // Retrieve all bid
    router.get("/allbids/:freelancer_post_id", contact.findAllBids);
    
    // Retrieve all bid with status = 0
    router.get("/allzerobids/:freelancer_post_id", contact.findAllStatusZeroBids);
    
    // Retrive count of bid
    router.get("/countbids/:freelancer_post_id", contact.countBids);

    // // Retrieve all published Category
    // router.get("/published", category.findAllPublished);
    
    // Retrieve a single Category with id
    router.get("/:id", contact.findOne);
    
    // Update a Tutorial with id
    router.put("/:id", contact.update);
    
    // Delete a Category with id
    router.delete("/:id", contact.delete);
    
    // Update status of a contact with id
    router.put("/changeContactStatus/:contact_id/:status", [verifyToken, isOwnerContact], contact.changeContactStatus);

    // show contact by contact_id
    router.get("/showContact/:contact_id", contact.showContactByContactId);
    // // Delete all Tutorials
    // router.delete("/", category.deleteAll);

    router.get("/getDistinctClientIdsByStatus/:bid_status", contact.getDistinctClientIdsByStatus);
    
    app.use('/api/contact', router);
    }