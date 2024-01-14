const db = require("../models");
const ProjectPost = db.project_post;

isOwnerProjectPost = (req, res, next) => {
    const id = req.params.project_post_id;

    const userId = req.userId;

    ProjectPost.findByPk(id, {attributes: ["user_id"]})
    .then(data => {
        console.log(data);
        if (data.user_id == userId)
            next();
        else 
            res.status(403).send({mesage: "Permission denied! Required owner or member of the project."});
    }).catch(error => {
        res.status(500).send({mesage: "Error retrieving project: ", error});
    })
}

const projectPostMiddleware = {
    isOwnerProjectPost: isOwnerProjectPost,
}
module.exports = projectPostMiddleware;