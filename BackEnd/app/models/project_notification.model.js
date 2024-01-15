module.exports = (sequelize, Sequelize) => {
    const ProjectNotification = sequelize.define("project_notification", {
      content: {
        type: Sequelize.STRING(1024),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(1024),
        allowNull: false
      }
    });
  
    return ProjectNotification;
  };
  