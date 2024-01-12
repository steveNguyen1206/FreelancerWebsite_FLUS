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
    Issue.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
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
        message: err.message || "Some error occurred while retrieving users.",
    });
    });
};  
