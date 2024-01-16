const db = require("../models");
const User = db.user;
const FreelacerPost = db.freelancer_post;
const Contact = db.contact;

isOwnerContact = (req, res, next) => {
    const contact_id = req.params.contact_id;
    const userId = req.userId;

    console.log("test in contact midđle", contact_id, userId)
    Contact.findByPk(contact_id, {
        include: [
            {
                model: FreelacerPost,
                as: "freelancer_post",
                attributes: ["id", "freelancer_id"]
            },

        ]
    })
    .then((data) => {
        console.log(data)
        const freelancer_id = data.freelancer_post.freelancer_id;
        if(freelancer_id == userId)
        {
            next();
        }
        else 
        {
            res.status(403).send({message: "Permission denied! Required member of the project."});
        }
    })
    .catch((error) => {
        res.status(500).send({message: "Error retrieving contact in middleware: "+ error});
    })
};

isUser = (req, res, next) => {
    // get id from request 
    const id = req.params.id ?  req.params.id :  req.body.id;
    // user id from middleware verifyToken
    const userId = req.userId;

    console.log("##### IS OWNER #####");
    console.log("##### userId " + userId);
    console.log("##### id  " + id);
    console.log("##### params");
    console.log(req.params);
    
    if (!id) {
        return res.status(403).send({
          message: "No id provided!",
        });
    }

    User.findByPk(userId)
    .then((user) => {
        // if user exist
        if (!user) {
            return res.status(403).send({
              message: "No user found!",
            });
        }
    })

    if (userId != id) {
        return res.status(403).send({
          message: "Permission denied!!",
        });
    }

    next();
};

const contactMiddleware = {
    isOwnerContact: isOwnerContact,
    isUser: isUser
}
module.exports = contactMiddleware;
