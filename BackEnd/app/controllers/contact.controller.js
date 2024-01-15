const db = require("../models");
const Contact = db.contact;
const User = db.user;
const Freelancer_post = db.freelancer_post;
const Op = db.Sequelize.Op;

// Create and Save a new Contact
// `http://localhost:8080/api/Contact`
exports.create = (req, res) => {
  // Validate request
  if (!req.body.job_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  console.log(req.body)

  // Create a Contact
  const contact = {
    // budget: req.body.budget,
    client_name: req.body.client_name,
    client_company: req.body.client_company,
    job_name: req.body.job_name,
    job_description: req.body.job_description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    budget: req.body.budget,  
    status: req.body.status,
    project_id: req.body.project_id,
    freelancer_post_id: req.body.freelancer_post_id,
    client_id: req.body.client_id
  };
  console.log(contact)
  // Save Tutorial in the database
  Contact.create(contact)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
// `http://localhost:8080/api/Contact`
exports.findAll = (req, res) => {
  const amount = req.query.amount;
  var condition = amount ? { amount: { [Op.like]: `%${amount}%` } } : null;

  Contact.findAll({ where: condition })
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

// Find a single Tutorial with an id
// `http://localhost:8080/api/Contact/${id}`
exports.findOne = (req, res) => {
  const id = req.params.id;

  Contact.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Contact by the id in the request
// `http://localhost:8080/api/Contact/${id}`
exports.update = (req, res) => {
  const id = req.params.id;

  // Contact.update(req.body, {
  //   where: { id: id }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       res.send({
  //         message: "Tutorial was updated successfully."
  //       });
  //     } else {
  //       res.send({
  //         message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating Tutorial with id=" + id
  //     });
  //   });

  const num = Contact.update(req.body, {
    where: { id: id }
  })

  if (num == 1) {
    return res.status(200).json({
      message: "Tutorial was updated successfully."
    });
  }
  else {
    res.status(500).json({
      message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
    });
  }
};

// Delete a Tutorial with the specified id in the request
// `http://localhost:8080/api/Contact/${id}`
exports.delete = (req, res) => {
  const id = req.params.id;

  Contact.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
//`http://localhost:8080/api/Contact`
exports.deleteAll = (req, res) => {
  Contact.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

exports.findAllContact  = (req, res) => {
    const contact_id = req.query.contact_id;
    var condition = contact_id ? { contact_id: { [Op.like]: `%${contact_id}%` } } : null;


    Contact.findAll({
        where: condition,
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'email', 'role', 'status'],
            },
            {
                model: Freelancer_post_id,
                attributes: ['freelancer_id']
            }
        ],
        
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving findAllContact data."
        });
    });
}


// find all published Tutorial
// exports.findAllPublished = (req, res) => {
//   Contact.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     });
// };

exports.findAllBids = (req, res) => {
  const post_id = req.params.freelancer_post_id;
  console.log(post_id)
  // var condition = freelancer_post_id ? { freelancer_post_id: { [Op.like]: `${freelancer_post_id}%` } } : null;

  Contact.findAll({
    where: {
      freelancer_post_id: {
        [Op.eq]: post_id
      },
    },
    include: [
      {
        model: User,
        attributes: ['id', 'account_name', 'profile_name', 'avt_url', 'email'],
      },
    ],

  })
    .then(data => {

      return res.json(data)
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving findAllBids data."
      });
    });
}


// exports.findAllPosts = (req, res) => {
//     const freelancer_id = req.query.freelancer_id;
//     var condition = freelancer_id ? { freelancer_id: { [Op.like]: `%${freelancer_id}%` } } : null;

//     Freelancer_post.findAll({
//         where: condition,
//         include: [
//             {
//                 model: User,
//                 attributes: ['id', 'account_name', 'profile_name', 'avt_url', 'email'],
//             },
//             {
//                 model: Subcategory,
//                 attributes: ['id', 'subcategory_name'],
//             },
//         ],

//     })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving data."
//             });
//         });
// };


exports.getDistinctClientIdsByStatus = (req, res) => {
  const status = req.params.bid_status;
  Contact.findAll({
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('client_id')), 'client_id']],
      where: { status: status }
  })
      .then(data => {
          res.status(200).send(data);
      })
      .catch(err => {
          console.log("err: ", err);
          res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving distinct client_ids."
          });
      });
}




exports.countBids = (req, res) => {
  const post_id = req.params.freelancer_post_id;
  console.log(post_id);

  Contact.findAndCountAll({
    where: {
      freelancer_post_id: {
        [Op.eq]: post_id
      },
      status: {
        [Op.eq]: 0
      }
    },
    include: [
      {
        model: User,
        attributes: ['id', 'account_name', 'profile_name', 'avt_url', 'email'],
      },
    ],
  })
    .then(data => {
      const count = data.count; // Số lượng dữ liệu được tìm thấy
      // const results = data.rows; // Dữ liệu tìm thấy
      
      return res.json(count);
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving countBids data."
      });
    });
}

exports.changeContactStatus = (req, res) => {
  const contact_id = req.params.contact_id;
  const status = req.params.status;

  console.log("contact_id: " + contact_id);
  console.log("status: " + status);
  Contact.update({ status: status }, { where: { id: contact_id } })
      .then(data => {
          res.status(200).send({
              message: "Update contact status successfully."
          });
      })
      .catch(err => {
          res.status(500).send({
              message:
              err.message || "Some error occurred while updating contact status."
          });
      });
}


exports.findAllStatusZeroBids = (req, res) => {
  const post_id = req.params.freelancer_post_id;
  console.log(post_id)
  // var condition = freelancer_post_id ? { freelancer_post_id: { [Op.like]: `${freelancer_post_id}%` } } : null;

  Contact.findAll({
    where: {
      freelancer_post_id: {
        [Op.eq]: post_id
      },
      status: {
        [Op.eq]: 0
      }
    },
    include: [
      {
        model: User,
        attributes: ['id', 'account_name', 'profile_name', 'avt_url', 'email'],
      },
    ],

  })
    .then(data => {

      return res.json(data)
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving findAllBids data."
      });
    });
}

// exports.findContactByProjectId = (req, res) => {
//   const project_id = req.params.project_id;
//   console.log(project_id)
//   // var condition = freelancer_post_id ? { freelancer_post_id: { [Op.like]: `${freelancer_post_id}%` } } : null;

//   Contact.findAll({
//     where: {
//       project_id: {
//         [Op.eq]: project_id
//       },
//     },
//     include: [
//       {
//         model: Freelancer_post,
//         attributes: ['freelancer_id', 'subcategory_id'],
//       },
//     ],

//   })
//     .then(data => {

//       return res.json(data)
//     })
//     .catch(err => {
//       res.status(500).send({
//           message: err.message || "Some error occurred while retrieving findAllBids data."
//       });
//     });
// }

exports.showContactByContactId = (req, res) => {
  const contact_id = req.params.contact_id;
  console.log(contact_id)
  // var condition = freelancer_post_id ? { freelancer_post_id: { [Op.like]: `${freelancer_post_id}%` } } : null;

  Contact.findAll({
    where: {
      id: {
        [Op.eq]: contact_id
      },
    },
    include: [
      {
        model: Freelancer_post,
        attributes: ['freelancer_id', 'skill_tag'],
      },
    ],

  })
    .then(data => {

      return res.json(data)
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving findAllBids data."
      });
    });
}