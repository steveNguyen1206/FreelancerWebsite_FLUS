const db = require("../models");
const cloudinary = require("../config/cloudinary.config");
const Freelancer_post = db.freelancer_post;
const User = db.user;
const Subcategory = db.subcategories;
const Op = db.Sequelize.Op;

// Create and Save a new Freelancer_post
// exports.create = async (req, res) => {
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    async function handleUpload(file) { // đưa lên cloud
        const res = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });

        return res;
    }
    // const img_url = '';
    try {
        // lấy link trên cloud
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        console.log(cldRes.secure_url);
        const img_url = cldRes.secure_url;
        console.log("img_url: ", img_url)
        console.log("req.body: ", req.body)
        const freelancer_post = {
            title: req.body.title,
            freelancer_id: req.body.freelancer_id,
            about_me: req.body.about_me,
            skill_description: req.body.skill_description,
            lowset_price: req.body.lowset_price,
            delivery_due: req.body.delivery_due,
            revision_number: req.body.revision_number,
            delivery_description: req.body.delivery_description,
            // imgage_post_urls: req.body.imgage_post_urls,
            imgage_post_urls: img_url,
            skill_tag: req.body.skill_tag,
            status: 1
        };
        console.log("freelancer_post: ", freelancer_post)
        // Save Freelancer_post in the database
        Freelancer_post.create(freelancer_post)
            .then(data => {
                // res.send(data);
                return res.status(200).json({
                    message: "Freelancer post was created successfully.",
                    // avt_url: avt_url
                });
            })
            .catch(err => {
                return res.status(500).json({
                    message:
                        err.message ||
                        "Some error while creating freelancer post"
                });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                "failed r huhu"
        });
    }
    // console.log(img_url);


    // console.log(req.body.freelancer_id);
    // Create a freelancer_post

};


// Find all Freelancer_posts by user id and change their status
exports.findAndChangeStatus = (req, res) => {
    const { userId, status } = req.params;
    const condition = userId ? { freelancer_id: { [Op.eq]: `${userId}` } } : null;

    Freelancer_post.update({ status: status }, { where: condition })
        .then(num => {
            if (num > 0) {
                res.send({
                    message: "Status of Freelancer_posts was updated successfully."
                });
            } else {
                res.send({
                    message: `No Freelancer_posts found for user id=${userId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating status of Freelancer_posts for user id=" + userId
            });
        });
};

// Retrieve all Freelancer_post from the database.
exports.findAll = (req, res) => {
    const freelancer_id = req.params.freelancer_id;
    
     var condition = freelancer_id ? { freelancer_id: { [Op.like]: `%${freelancer_id}%` } } : null;

    Freelancer_post.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};


// change status of many freelancer_posts by list of freelancer_post_id
exports.changeStatus = (req, res) => {
    const { freelancer_post_id_list, status } = req.body;
    const condition = freelancer_post_id_list ? { freelancer_post_id: { [Op.in]: `${freelancer_post_id_list}` } } : null;
    Freelancer_post.update({ status: status }, { where: condition })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Freelancer_post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Freelancer_post with id=${freelancer_post_id}. Maybe Freelancer_post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Freelancer_post with id=" + freelancer_post_id
            });
        });
};

// Find a single Freelancer_post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Freelancer_post.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Freelancer_post with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Freelancer_post with id=" + id
            });
        });
};

// Update a Category by the id in the request
// exports.update = (req, res) => {
//     // const id = req.params.id;
//     console.log(req.body);
//     const id = req.body.id;
//     console.log(id);
//     var condition = id ? { id: { [Op.eq]: `${id}` } } : null;

//     // const change = {
//     //     skill_description: "this is a skill description"
//     // }

//     const skill_description = "this is a skill description"

//     Freelancer_post.update({skill_description}, {
//         where: { id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Freelancer_post was updated successfully."
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot update Freelancer_post with id=${id}. Maybe Freelancer_post was not found or req.body is empty!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error updating Freelancer_post with id=" + id
//             });
//         });
// };


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
    console.log('freelancer_post id: ', id)
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

            const [num] = await Freelancer_post.update(updatedData, {
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
            const id = req.params.id;

            // If a new image is provided, update with the new image

            // Get the old image url
            const existingPost = await Freelancer_post.findByPk(id);
            const oldUrl = existingPost.imgage_post_urls;

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


            const [num] = await Freelancer_post.update(updatedData, {
                where: { id: req.params.id }
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
// Delete a Category with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;

//     Freelancer_post.destroy({
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Freelancer_post was deleted successfully!"
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot delete Freelancer_post with id=${id}. Maybe Freelancer_post was not found!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete Freelancer_post with id=" + id
//             });
//         });
// };

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//     Category.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Category were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all categories."
//             });
//         });
// };

exports.findAllPosts = (req, res) => {
    const freelancer_id = req.params.freelancer_id;

    // console.log("#############################\n");
    // console.log("FIND ALL FREELANCER POSTS");
    // console.log("Params: ", req.params);
    // console.log("freelancer_id: ", freelancer_id);
   
    var condition = freelancer_id? { freelancer_id: { [Op.eq]: `${freelancer_id}` } } : null;

    Freelancer_post.findAll({
        where: condition,
        include: [
            {
                model: User,
                attributes: ['id', 'account_name', 'profile_name', 'avt_url', 'email'],
            },
            {
                model: Subcategory,
                attributes: ['id', 'subcategory_name'],
            },
        ],

    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving data."
            });
        });
};


exports.getFreelancerEmail = (req, res) => {
    const postId = req.params.id;
  
    Freelancer_post.findByPk(postId, {
      include: {
        model: User,
        attributes: ['email'],
      },
    })
      .then(freelancerPost => {
        if (!freelancerPost) {
          return res.status(404).json({ message: 'Freelancer post not found' });
        }
  
        const email = freelancerPost.user.email;
        return res.json(email);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving data.',
        });
      });
  };

  function getPagination(page, size) {
    // page > 0, size > 0
    const limit = size;
    const offset = (page - 1) * size;
    return { limit, offset };
  }
  
  exports.findFreePostsByPage = (req, res) => {
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
              { skill_description: { [Op.like]: `%${searchKey}%` } },
            ],
          }
        : null;
  
    const { limit, offset } = getPagination(parseInt(page), parseInt(size));
  
    // Find all users with condition by page
    Freelancer_post.findAndCountAll({ where: condition, limit, offset })
      .then((data) => {
        const { rows: free_posts, count: totalItems } = data;
  
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
          free_posts: free_posts,
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
  
    Freelancer_post.update({ status }, { where: { id } })
      .then((num) => {
        if (num[0] === 1) {
          res.send({
            message: "Freelancer_post status updated successfully!",
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

exports.deleteById = (req, res) => {
    const { id } = req.params;

    Freelancer_post.findByPk(id)
        .then((project) => {
            if (!project) {
                res.status(404).send({
                    message: `Freelancer_post with id=${id} not found.`,
                });
                return;
            }

            const imageUrls = project.imgage_post_urls;

            Freelancer_post.destroy({ where: { id } })
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
                message: "Could not find Freelancer_post with id=" + id,
            });
        });
};

  