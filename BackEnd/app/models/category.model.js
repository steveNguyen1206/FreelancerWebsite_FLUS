module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      img: {
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: true
      },
    });
  
    return Category;
  };
  