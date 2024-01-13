const db = require("../models");
const Project_post = db.project_post;


exports.create = (req, res) => {

    console.log(req.body)
    // validate request
    // if (!req.body.title || !req.body.detail || !req.body.budget_min || !req.body.budget_max || !req.files || Object.keys(req.files).length === 0) {
    //     res.status(400).send({
    //         message: "Invalid request. All fields and image are required."
    //     });
    //     return;
    // }


    // Create a project
    const project_post = {
        id: "1",
        title: req.body.title,
        detail: req.body.detail,
        pushlish_time: "2021-05-05",
        budget_min: parseFloat(req.body.budget_min),
        budget_max: parseFloat(req.body.budget_max),
        imgage_post_urls: "https://www.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_38669459.htm#query=IT&position=0&from_view=search&track=sph&uuid=5c2c54a1-5397-45c8-bb6e-6eb8a4d37e51",
        status: true,
        created_at: "2021-05-05",
        updated_at: "2021-05-05",
    };
    Project_post.create(project_post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error creating Project_post."
            });
        });
};

exports.findAll = (req, res) => {
    Project_post.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Project_post."
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    Project_post.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: "Project_post not found."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Project_post with id=" + id
            });
        });
}

exports.updateNotNull = (req, res) => {
    const id = req.params.id;

    Project_post.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Project was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Project with id=${id}. Maybe Project_post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Project with id=" + id
            });
        });
}
