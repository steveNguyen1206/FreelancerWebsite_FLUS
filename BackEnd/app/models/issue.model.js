module.exports = (sequelize, Sequelize) => {
    const Issue = sequelize.define("issue", {
      content: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      resources: {
        type: Sequelize.STRING(1024),
        allowNull: true
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
    });
  
    return Issue;
  };
  