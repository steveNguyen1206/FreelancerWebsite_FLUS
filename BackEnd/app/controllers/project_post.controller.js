const db = require("../models");
const cloudinary = require("../config/cloudinary.config");
const project_post = db.project_post;
const user = db.user;
const subcategories = db.subcategories;
const review = db.review;
const comment_proj = db.comment_proj;

// Create and Save a new Project_post
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

async function handleDelete(file) {
  try {
    const res = await cloudinary.uploader.destroy(file, {
      resource_type: "image",
    });
    return res;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

exports.create = async (req, res) => {
  console.log("body: ", req.body);
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // check the title is already exist, if yes, return error
  const existingProject = await project_post.findOne({
    where: { title: req.body.title },
  });
  if (existingProject) {
    res.status(400).send({
      message: "Project title already exists.",
    });
    return;
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    console.log(cldRes.secure_url);
    const img_url = cldRes.secure_url;

    const projectPost = {
      title: req.body.title,
      detail: req.body.detail,
      budget_min: req.body.budget_min,
      budget_max: req.body.budget_max,
      imgage_post_urls: img_url,
      user_id: req.userId,
      tag_id: req.body.tag_id,
      start_date: req.body.start_date,
      status: 1,
    };

    project_post
      .create(projectPost)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the Project_post.",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

// Find all Project_posts by user id and set their status to status param
exports.findAndChangeStatus = (req, res) => {
  const { userId, status } = req.params;

  project_post
    .update({ status: status }, { where: { user_id: userId } })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Project_posts status updated successfully.",
        });
      } else {
        res.send({
          message: `No Project_posts found for user with id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          "Error updating Project_posts status for user with id=" + userId,
      });
    });
};

// Retrieve all Project_posts from the database.
exports.findAllProjectPosts = (req, res) => {
  // for each project post, check expired startDate, if expired, set status = 0
  project_post
    .findAll({ where: { status: 1 } })
    .then((data) => {
      data.forEach((projectPost) => {
        const startDate = new Date(projectPost.start_date);
        const currentDate = new Date();
        if (startDate < currentDate) {
          project_post.update({ status: 0 }, { where: { id: projectPost.id } });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });

  project_post
    .findAll({
      where: { status: 1 },
      include: [
        {
          model: user,
          attributes: [
            "id",
            "account_name",
            "profile_name",
            "email",
            "avt_url",
          ],
        },
        {
          model: subcategories,
          foreignKey: "tag_id",
          attributes: ["id", "subcategory_name"],
        },
      ],
    })
    .then((data) => {
      return Promise.all(
        data.map((project_post) => {
          return review
            .findAll({
              where: { user_reviewed: project_post.user_id, type: 1 },
            })
            .then((reviews) => {
              let sum = 0;
              reviews.forEach((review) => {
                sum += review.star;
              });
              project_post.user.dataValues.avg_rating =
                sum / reviews.length || 0;
              return project_post;
            });
        })
      );
    })
    .then((projectPosts) => {
      res.send(projectPosts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving reviews.",
      });
    });
};

// change status of many project_posts by list of project_post_id
exports.changeStatus = (req, res) => {
  const { status, project_post_id } = req.body;
  project_post
    .update({ status: status }, { where: { id: project_post_id } })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "project_post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update project_post with id=${project_post_id}. Maybe project_post was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating project_post with id=" + project_post_id,
      });
    });
};

// get all project post with status = 1
exports.findOne = (req, res) => {
  const id = req.params.id;

  project_post
    .findByPk(id, {
      include: [
        {
          model: user,
          attributes: [
            "id",
            "account_name",
            "profile_name",
            "email",
            "avt_url",
          ],
        },
        {
          model: subcategories,
          foreignKey: "tag_id",
          attributes: ["id", "subcategory_name"],
        },
      ],
    })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found project_post with id " + id,
        });
      } else {
        return review
          .findAll({
            where: { user_reviewed: data.user_id, type: 1 },
          })
          .then((reviews) => {
            let sum = 0;
            reviews.forEach((review) => {
              sum += review.star;
            });
            data.user.dataValues.avg_rating = sum / reviews.length || 0;
            return data;
          });
      }
    })
    .then((data) => {
      // find comments of project post
      return comment_proj
        .findAll({
          where: { proj_post_id: id, parent_id: null },
        })
        .then((comments) => {
          const promises = comments.map((comment) => {
            return comment_proj.findAll({
              where: { parent_id: comment.id },
            });
          });
          return Promise.all(promises).then((childComments) => {
            for (let i = 0; i < comments.length; i++) {
              comments[i].dataValues.childComments = childComments[i];
            }
            data.dataValues.comments = comments;
            return data;
          });
        });
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving project_post with id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  console.log("body: ", req.body);

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  const id = req.params.project_post_id;

  console.log("req.file: ", req.file);

  try {
    if (!req.file) {
      // If no new image is provided, update without changing the existing image
      const updatedData = Object.keys(req.body)
        .filter(
          (key) => key !== "id" && key !== "imgage_post_urls" && req.body[key]
        )
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      console.log("updated", updatedData);

      const [num] = await project_post.update(updatedData, {
        where: { id: id },
      });

      if (num > 0) {
        res.send({
          message: "project_post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update project_post with id=${id}. Maybe project_post was not found or req.body is empty!`,
        });
      }
    } else {
      const existingProject = await project_post.findByPk(id);
      const oldUrl = existingProject.imgage_post_urls;

      console.log("oldUrl: ", oldUrl);

      // Delete old image
      await handleDelete(oldUrl);

      // Upload new image
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      console.log(cldRes.secure_url);
      const img_url = cldRes.secure_url;
      console.log("img_url: ", img_url);

      // Update project_post with new data
      const updatedData = Object.keys(req.body)
        .filter((key) => key !== "id" && req.body[key])
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      updatedData.imgage_post_urls = img_url;

      console.log("updated", updatedData);

      const [num] = await project_post.update(updatedData, {
        where: { id: id },
      });

      if (num > 0) {
        res.send({
          message: "project_post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update project_post with id=${id}. Maybe project_post was not found or req.body is empty!`,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
