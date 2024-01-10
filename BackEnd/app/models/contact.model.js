module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
      client_name: {
        type: Sequelize.STRING(50)
      },
      client_company: {
        type: Sequelize.STRING(50)
      },
      job_name: {
        type: Sequelize.STRING(50)
      },
      job_description: {
        type:  Sequelize.STRING(512)
      },
      start_date: {
        type:  Sequelize.DATEONLY
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      budget: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.TINYINT
      },
      project_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return Contact;
  };
  