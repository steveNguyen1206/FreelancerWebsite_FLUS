// write controller for issuse model include crud operation

const db = require("../models");
const Issue = db.issues;
const Op = db.Sequelize.Op;
const Project = db.projects;
const ProjectNoti = db.projects_notis;
const User = db.user;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.content
        || !req.body.type) {
        res.status(400).send({
            message: "Missing information!"
        });
        return;
    }

    const projectId = req.body.projectId;
    const issueType = req.body.type;
    // Create a issue
    Project.findByPk(projectId)
        .then(project_data => {
            if (project_data.status != 3) {
                if ((issueType == 1 && project_data.owner_id == req.userId) || (issueType == 2 && project_data.member_id == req.userId)) {
                    const issue = {
                        content: req.body.content,
                        resources: req.body.resources,
                        type: req.body.type,
                        status: 0,
                        userId: req.userId,
                        project_id: projectId,
                        amount: (req.body.type == 1) ? project_data.budget * 0.3 : project_data.budget * 0.7
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
                } else {
                    res.status(400).send({
                        message: "You are not allowed to create issue!"
                    });
                }
            } else {
                res.status(400).send({
                    message: "Bad request! Either the project is not existed or it is already closed!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Project with id=" + id,
            });
        });
};


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
    const id = req.params.issueId;

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
    const id = req.params.issueId;

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

// Retrieve all issues
exports.getAllIssues = (req, res) => {
    Issue.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving issues."
            });
        });
};


// Define the getPagination function
function getPagination(page, size) {
    // page > 0, size > 0
    const limit = size;
    const offset = (page - 1) * size;
    return { limit, offset };
}

exports.findIssuesByPage = (req, res) => {
    console.log("\nMY PARAMS:", req.params);
    const { page, size, searchKey } = req.params; // page: 1..n, size: 1..m
    console.log(
        "FFFFFFFFFFFFFFFFFFFF",
        "page: " + page + ", size: " + size + ", searchKey: " + searchKey
    );

    // condition to check searchKey in account_name or profile_name
    var condition =
        searchKey && searchKey !== "undefined" && searchKey !== ""
            ? {
                [Op.or]: [
                    { content: { [Op.like]: `%${searchKey}%` } },
                    { project_id: { [Op.like]: `%${searchKey}%` } },
                ],
            }
            : null;

    const { limit, offset } = getPagination(parseInt(page), parseInt(size));

    // Find all users with condition by page
    Issue.findAndCountAll({ where: condition, limit, offset , include: [{ model: Project, as: "project" }]})
        .then((data) => {
            // console.log(data)
            const { rows: m_issues, count: totalItems } = data;

            const response = {
                totalItems,
                issues: m_issues,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / limit),
            };

            res.send(response);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving issues.",
            });
        });
};


exports.acceptIssue = (req, res) => {
    const id = req.params.issueId;
    Issue.update({ status: 1 }, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            // res.status(200).send({
            // message: "Issue was updated successfully."
            // });

            const upadte = { status: 5 }
            Project.update(upadte, {
                where: { id: req.body.projectId }
            })
                .then(num => {
                    if (num == 1) {
                        const notification = {
                            title: req.body.subject,
                            content: req.body.message,
                            creator_id: req.userId,
                            project_id: req.body.projectId
                        }

                        ProjectNoti.create(notification)
                            .then(noti_data => {
                                // res.send(project_data);
                                // res.send({
                                //     message: "Refound successfully."
                                // });

                                let reported_time = User.findByPk(req.userId)
                                
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while resoling issue."
                                });
                            });
                    } else {
                        res.send({
                            message: `Cannot update project`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating Project with error=" + err
                    });
                });
        } else {
            res.send({
                message: `Cannot update Issue with id=${id}`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Issue with id=" + id
        });
    });
}

exports.rejectIssue = (req, res) => {
    const id = req.params.issueId;
    Issue.update({ status: 2 }, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            const upadte = { status: 5 }
            Project.update(upadte, {
                where: { id: req.body.projectId }
            })
                .then(num => {
                    if (num == 1) {
                        const notification = {
                            title: req.body.subject,
                            content: req.body.message,
                            creator_id: req.userId,
                            project_id: req.body.projectId
                        }

                        ProjectNoti.create(notification)
                            .then(noti_data => {
                                // res.send(project_data);
                                res.send({
                                    message: "Issue resolved!"
                                });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while resolving issue."
                                });
                            });
                    } else {
                        res.send({
                            message: `Cannot update project`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating Project with error=" + err
                    });
                });
        } else {
            res.send({
                message: `Cannot update Issue with id=${id}`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Issue with id=" + id
        });
    });
}