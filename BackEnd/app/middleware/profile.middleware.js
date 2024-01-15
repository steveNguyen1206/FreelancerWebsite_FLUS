const db = require("../models");
const User = db.user;

isOwner = (req, res, next) => {
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

const profileMiddleware = {
    isOwner: isOwner
}
module.exports = profileMiddleware;
