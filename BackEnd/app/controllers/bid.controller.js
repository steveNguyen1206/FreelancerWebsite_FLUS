const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const Bid = db.bid;
const projectPost = db.project_post;
const Project = db.projects;

exports.create = async (req, res) => {
  console.log("req.body: ", req.body);
  console.log("req.userId: ", req.userId);

  // check if req.body is empty
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const bid = {
    price: req.body.price,
    message: req.body.message,
    duration: req.body.duration,
    email: req.body.email,
    status: 0,
    user_id: req.userId,
    proj_post_id: req.body.proj_post_id,
    skill_tag: req.body.skill_id,
  };

  // Check if a bid with the same properties already exists
  const existingBid = await Bid.findOne({ where: bid });
  if (existingBid) {
    // If a bid with the same properties exists, send an error response
    res
      .status(400)
      .send({ message: "A bid with the same properties already exists." });
    return;
  }

  Bid.create(bid)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Bid.",
      });
    });
};
exports.findBidByProjectId = async (req, res) => {
  const project_id = req.params.project_id;

  try {
    const bids = await Bid.findAll({
      where: { proj_post_id: project_id, status: 0 },
      include: [
        {
          model: db.user,
          attributes: [
            "id",
            "account_name",
            "email",
            "avt_url",
            "profile_name",
          ],
        },
        {
          model: db.subcategories,
          attributes: ["id", "subcategory_name"],
        },
      ],
    });

    res.status(200).send(bids);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bid.",
    });
  }
};

exports.changeOtherBidStatus = (req, res) => {
  const bid_id = req.params.bid_id;
  const status = req.params.status;

  Bid.update({ status: status }, { where: { id: { [Op.not]: bid_id } } })
    .then((data) => {
      res.status(200).send({
        message: "Update other bid status successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating other bid status.",
      });
    });
};

exports.getProjectPostfromBid = (req, res) => {
  const bid_id = req.params.bid_id;

  console.log("bid_id:", bid_id);

  Bid.findOne({ where: { id: bid_id } })
    .then((data) => {
      projectPost
        .findOne({ where: { id: data.proj_post_id } })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving project post.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving bid.",
      });
    });
};

exports.acceptBid = (req, res) => {
  const bid_id = req.params.bid_id;

  let projectData = {};
  let duration = 0;
  let projectPostId = 0;

  Bid.findOne({ where: { id: bid_id } })
    .then((bid) => {
      projectData.created_bid_id = bid.id;
      projectData.budget = bid.price;
      projectData.member_id = bid.user_id;
      projectData.status = 0;
      duration = bid.duration;
      projectPostId = bid.proj_post_id;
      return projectPost.findOne({ where: { id: bid.proj_post_id } });
    })
    .then((project) => {
      projectData.project_name = project.title;
      projectData.project_description = project.detail;
      projectData.start_date = project.start_date;

      let endDate = new Date(project.start_date);
      endDate.setDate(endDate.getDate() + duration);
      let endDateString =
        endDate.getFullYear() +
        "-" +
        (endDate.getMonth() + 1) +
        "-" +
        endDate.getDate();

      projectData.end_date = endDateString;
      projectData.tag_id = project.tag_id;
      projectData.owner_id = project.user_id;
      return Bid.update({ status: 1 }, { where: { id: bid_id } });
    })
    .then(() => {
      return Project.create(projectData);
    })
    .then((newProject) => {
      // Update all other bids for the project post to -1
      return Bid.update(
        { status: -1 },
        { where: { proj_post_id: projectPostId, id: { [Op.ne]: bid_id } } }
      ).then(() => newProject);
    })
    .then((newProject) => {
      // Update the status of the project post to -1
      return projectPost
        .update({ status: 0 }, { where: { id: projectPostId } })
        .then(() => newProject);
    })
    .then((newProject) => {
      res.status(200).send({
        message: "Accept bid successfully.",
        projectId: newProject.id,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while accept bid.",
      });
    });
};

exports.rejectBid = (req, res) => {
  const bid_id = req.params.bid_id;

  Bid.update({ status: -1 }, { where: { id: bid_id } })
    .then((data) => {
      res.status(200).send({
        message: "Reject bid successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while reject bid.",
      });
    });
};

exports.getDistinctUserIdsByStatus = (req, res) => {
  const status = req.params.bid_status;
  Bid.findAll({
    attributes: [
      [db.Sequelize.fn("DISTINCT", db.Sequelize.col("user_id")), "user_id"],
    ],
    where: { status: status },
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving distinct user ids.",
      });
    });
};
