module.exports = (sequelize, Sequelize) => {
    const ProjectReport = sequelize.define("project_report", {
      message: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      resources: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      
      status: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      
    });
  
    return ProjectReport;
  };
  