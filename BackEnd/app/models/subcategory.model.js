module.exports = (sequelize, Sequelize) => {
   // Define the Subcategory model
const Subcategory = sequelize.define('subcategories', {
    subcategory_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique : true
    },
    // // category_id is the foreign key referencing the id column in the categories table
    // category_id: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'categories', // This is the name of the referenced model
    //     key: 'id' // This is the name of the referenced column in the categories table
    //   }
    // }
  });
  
    return Subcategory;
  };
  
