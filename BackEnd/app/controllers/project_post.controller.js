const db = require("../models");
const cloudinary = require("../config/cloudinary.config");
const project_post = db.project_post;
const Op = db.Sequelize.Op;



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
    console.log("body: ",req.body);
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    console.log("req.file: ", req.file);

    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        console.log(cldRes.secure_url);
        const img_url = cldRes.secure_url;
        console.log("img_url: ", img_url)

        const projectPost = {
            title: req.body.title,
            detail: req.body.detail,
            budget_min: req.body.budget_min,
            budget_max: req.body.budget_max,
            imgage_post_urls: img_url,
            user_id: req.body.user_id,
            tag_id: req.body.tag_id,
        };

        project_post.create(projectPost)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Project_post."
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

    project_post.update({ status: status }, { where: { user_id: userId } })
        .then(num => {
            if (num > 0) {
                res.send({
                    message: "Project_posts status updated successfully."
                });
            } else {
                res.send({
                    message: `No Project_posts found for user with id=${userId}.`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Project_posts status for user with id=" + userId
            });
        });
};


// Retrieve all Project_posts from the database.
exports.findAllProjectPosts = (req, res) => {
    const {userId} = req.params;
    const condition = userId ? { user_id: { [Op.eq]: `${userId}` } } : null;

    project_post.findAll({ where: condition })
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving project_posts."
        });
        });
};

// change status of many project_posts by list of project_post_id
exports.changeStatus = (req, res) => {
    const { project_post_id_list, status } = req.body;
    project_post.update({ status: status }, { where: { id: project_post_id_list } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "project_post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update project_post with id=${id}. Maybe project_post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error updating project_post with id=" + id
            });
        });
};


// get all project with status = 1
exports.findAll = (req, res) => {
    project_post.findAll({ where: { status: 1 } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving project_posts."
            });
        });
};

// get owner project `/project_post/owner/${id}`
exports.findOwnerProject = (req, res) => {
    const { id } = req.params;
    project_post.findAll({ where: { user_id: id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving project_posts."
            });
        });
};

// `/project_post/${id}`
exports.findOne = (req, res) => {
    const id = req.params.id;

    project_post.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                message: "project_post not found."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving project_post with id=" + id
            });
        });
};

// /project_post/update
exports.update = async (req, res) => {
    console.log("body: ", req.body);

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const id = req.params.id;

    console.log("req.file: ", req.file);

    try {
        if (!req.file) {
            // If no new image is provided, update without changing the existing image
            const updatedData = Object.keys(req.body)
                .filter(key => key !== 'id' && key !== 'imgage_post_urls' && req.body[key])
                .reduce((obj, key) => {
                    obj[key] = req.body[key];
                    return obj;
                }, {});

            console.log("updated", updatedData);

            const [num] = await project_post.update(updatedData, {
                where: { id: id }
            });

            if (num > 0) {
                res.send({
                    message: "project_post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update project_post with id=${id}. Maybe project_post was not found or req.body is empty!`
                });
            }
        } else {
            // If a new image is provided, update with the new image

            // Get the old image url
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
            .filter(key => key !== 'id' && req.body[key])
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

            updatedData.imgage_post_urls = img_url;

            console.log("updated", updatedData);


            const [num] = await project_post.update(updatedData, {
                where: { id: id }
            });

            if (num > 0) {
                res.send({
                    message: "project_post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update project_post with id=${id}. Maybe project_post was not found or req.body is empty!`
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error"
        });
    }
};


// Define the getPagination function
function getPagination(page, size) {
    // page > 0, size > 0
    const limit = size;
    const offset = (page - 1) * size;
    return { limit, offset };
  }
  
  exports.findProjPostsByPage = (req, res) => {
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
              { title: { [Op.like]: `%${searchKey}%` } },
              { detail: { [Op.like]: `%${searchKey}%` } },
            ],
          }
        : null;
  
    const { limit, offset } = getPagination(parseInt(page), parseInt(size));
  
    // Find all users with condition by page
    project_post.findAndCountAll({ where: condition, limit, offset })
      .then((data) => {
        const { rows: proj_posts, count: totalItems } = data;
  
        // // Extract only the necessary information from each user
        // const simplifiedProjPosts = proj_posts.map((proj_post) => ({
        //   id: proj_post.id,
        //   title: proj_post.title,
        //   detail: proj_post.detail,
        //   budget_min: proj_post.budget_min,
        //   budget_max: proj_post.budget_max,
        //   status: proj_post.status,
        // }));
  
        const response = {
          totalItems,
          proj_posts: proj_posts,
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
  

// Change user status by user id and status param
exports.changeStatusByID = (req, res) => {
    const { id, status } = req.params;
  
    if (!id || parseInt(status) < 0 || parseInt(status) > 2) {
      res.status(400).send({
        message: "Invalid projpost id or status!",
      });
      return;
    }
  
    project_post.update({ status }, { where: { id } })
      .then((num) => {
        if (num[0] === 1) {
          res.send({
            message: "Proj Post status updated successfully!",
          });
        } else {
          res.send({
            message: `Cannot update Post with id=${id}. Maybe Post was not found!`,
          });
        }
      })
      .catch((err) => {
        console.error("Sequelize Error:", err);
        res.status(500).send({
          message: "Could not update Post with id=" + id,
        });
      });
  };

exports.deleteById = (req, res) => {
    const { id } = req.params;

    project_post.findByPk(id)
        .then((project) => {
            if (!project) {
                res.status(404).send({
                    message: `Project with id=${id} not found.`,
                });
                return;
            }

            const imageUrls = project.imgage_post_urls;

            project_post.destroy({ where: { id } })
                .then((num) => {
                    if (num === 1) {
                        // Handle delete the file using imageUrls
                        handleDelete(imageUrls);
                        res.send({
                            message: "Post was deleted successfully!",
                        });
                    } else {
                        res.send({
                            message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
                        });
                    }
                })
                .catch((err) => {
                    console.error("Sequelize Error:", err);
                    res.status(500).send({
                        message: "Could not delete Post with id=" + id,
                    });
                });
        })
        .catch((err) => {
            console.error("Sequelize Error:", err);
            res.status(500).send({
                message: "Could not find Project with id=" + id,
            });
        });
};
