// write controller for issuse model include crud operation

const db = require("../models");
const Issue = db.issues;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.content || !req.body.resources || !req.body.type ) {
        res.status(400).send({
        message: "Missing information!"
        });
        return;
    }
    
    // Create a Tutorial
    const issue = {
        content: req.body.content,
        recources: req.body.resources,
        type: req.body.type,
        status: 0,
        userId: req.userId,
        project_id: req.body.projectId,
    };
    
    // Save Tutorial in the database
    Issue.create(issue)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Tutorial."
        });
        });
    }


exports.findAll = (req, res) => {   
    Issue.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving isuses."
        });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Issue.findByPk(id)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: "Error retrieving Issues with id=" + id
        });
        });
}

exports.update = (req, res) => {
    const id = req.params.id;

    Issue.update(req.body, {
        where: { id: id }
        })
        .then(num => {
        if (num == 1) {
            res.send({
            message: "Issue was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Issue with id=${id}. Maybe Issue was not found or req.body is empty!`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating Issue with id=" + id
        });
        });
}