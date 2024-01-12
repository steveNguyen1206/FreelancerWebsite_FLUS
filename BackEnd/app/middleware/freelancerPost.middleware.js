const db = require("../models");
const User = db.user;
const FreelacerPost = db.freelancer_post;

isOwnerPost = (req, res, next) => {
    const id = req.params.freelancerPostId;
    const userId = req.userId;
    // console.log(id, userId)
    Project.findOne({where: {id: id}, attributes: ["freelancer_id"]})
    .then((data) => {
        console.log(data.freelancer_id)
        if(data.freelancer_id == userId)
        {
            next();
        }
        else 
        {
            res.status(403).send({message: "Permission denied! Required member of the project."});
        }
    })
    .catch((error) => {
        res.status(500).send({message: "Error retrieving project in middleware: ", error});
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

const freelancerPostMiddleware = {
    isOwnerPost: isOwnerPost,
    isUser: isUser
}
module.exports = freelancerPostMiddleware;
