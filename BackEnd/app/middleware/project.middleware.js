const db = require("../models");
const Project = db.projects;
const ProjectPost = db.project_post;

isMember = (req, res, next) => {
    const id = req.params.projectId;
    const userId = req.userId;
    // console.log(id, userId)
    Project.findOne({where: {id: id}, attributes: ["member_id"]})
    .then((data) => {
        console.log(data.member_id)
        if(data.member_id == userId)
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


isOwner = (req, res, next) => {
    const id = req.params.projectId ?  req.params.projectId :  req.body.id;
    const userId = req.userId;
    Project.findByPk(id, {attributes: ["owner_id"]})
    .then((data) => {
        console.log(data.owner_id)
        if(data.owner_id == userId)
        {
            next();
        }
        else 
        {
            res.status(403).send({message: "Permission denied! Required owner of the project."});
        }
    })
    .catch((error) => {
        res.status(500).send({message: "Error retrieving project  in middleware: ", error});

    })
};

isMemberOrOwner = (req, res, next) => {
    console.log("tesst 23")
    console.log(req.params)
    const id = req.params.projectId;
    const userId = req.userId;
    console.log(id, userId);
    Project.findByPk(id, {attributes: ["owner_id", "member_id"]})
    .then((data) => {
        console.log(data.owner_id)
        if(data.owner_id == userId || data.member_id == userId)
        {
            next();
        }
        else 
        {
            res.status(403).send({mesage: "Permission denied! Required owner or member of the project."});
        }
    })
    .catch((error) => {
        res.status(500).send({mesage: "Error retrieving project: ", error});

    })
};

const projectMiddlware = {
    isMember: isMember,
    isOwner: isOwner,
    isMemberOrOwner: isMemberOrOwner,
}
module.exports = projectMiddlware;
