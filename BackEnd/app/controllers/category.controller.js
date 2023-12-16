const db = require("../models");
const category = db.category;
const subcategory = db.subcategories;
const Op = db.Sequelize.Op;


exports.getNameSubcategory = (req, res) => {
    const { id } = req.params;
    subcategory.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving category." });
        });
}