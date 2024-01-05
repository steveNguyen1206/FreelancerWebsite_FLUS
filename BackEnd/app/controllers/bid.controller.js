const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const Bid = db.bid;
const projectPost = db.project_post;

exports.create = (req, res) => {
    console.log("req.body: ", req.body);

    // check if req.body is empty
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // create user object in database
    const bid = {
        price: req.body.price,
        message: req.body.message,
        duration: req.body.duration,
        email: req.body.email,
        status: 0,
        user_id: req.body.user_id,
        proj_post_id: req.body.proj_post_id,
    }

    Bid.create(bid)
        .then(data => {
            res.status(200).send({
                 message: "Create bid sucessfully."
             });
         })
         .catch(err => {
             res.status(500).send({
                 message:
                 err.message || "Some error occurred while creating the Bid."
             });
         });
        
}

exports.findBidByProjectId = (req, res) => {
    const project_id = req.params.project_id;

    Bid.findAll({ where: { proj_post_id: project_id, status: 0, } })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving bids."
            });
        });
}

exports.changeBidStatus = (req, res) => {
    const bid_id = req.params.bid_id;
    const status = req.params.status;

    Bid.update({ status: status }, { where: { id: bid_id } })
        .then(data => {
            res.status(200).send({
                message: "Update bid status successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating bid status."
            });
        });
}

exports.changeOtherBidStatus = (req, res) => {
    const bid_id = req.params.bid_id;
    const status = req.params.status;

    Bid.update({ status: status }, { where: { id: { [Op.not]: bid_id } } })
        .then(data => {
            res.status(200).send({
                message: "Update other bid status successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating other bid status."
            });
        });
}


exports.getProjectPostfromBid = (req, res) => {
    const bid_id = req.params.bid_id;

    console.log("bid_id:", bid_id);

    Bid.findOne({ where: { id: bid_id } })
        .then(data => {
            console.log("data:\n\n\n", data);
            projectPost.findOne({ where: { id: data.proj_post_id } })
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message || "Some error occurred while retrieving project post."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving bid."
            });
        });
}


