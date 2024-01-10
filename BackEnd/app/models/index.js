const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.freelancer_post = require("./freelancer_post.model.js")(
  sequelize,
  Sequelize
);
db.contact = require("./contact.model.js")(sequelize, Sequelize);
db.subcategories = require("./subcategory.model.js")(sequelize, Sequelize);
db.bid = require("./bid.model.js")(sequelize, Sequelize);
db.comment_proj = require("./comment_proj.model.js")(sequelize, Sequelize);
db.project_post = require("./project_post.model.js")(sequelize, Sequelize);
db.review = require("./Review.model.js")(sequelize, Sequelize);
db.otp = require("./OTP.model.js")(sequelize, Sequelize);

db.transactions = require("./transaction.model.js")(sequelize, Sequelize);
db.projects = require("./project.model.js")(sequelize, Sequelize);
db.projects_reports = require("./project_report.model.js")(sequelize, Sequelize);
db.projects_notis = require("./project_notification.model.js")(sequelize, Sequelize);
db.issues = require("./issue.model.js")(sequelize, Sequelize);
db.payment_accounts = require("./payment_account.model.js")(
  sequelize,
  Sequelize
);

db.user_wishlist = require("./user_wishlist.model.js")(sequelize, Sequelize);

db.subcategories.belongsTo(db.categories, {
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.categories.hasMany(db.subcategories, {
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.freelancer_post.belongsTo(db.subcategories, {
  foreignKey: "skill_tag",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.freelancer_post.belongsTo(db.user, {
  foreignKey: "freelancer_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.contact.belongsTo(db.freelancer_post, {
  foreignKey: "freelancer_post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.contact.belongsTo(db.user, {
  foreignKey: "client_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//-----------------------------

db.transactions.belongsTo(db.user, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

db.transactions.belongsTo(db.user, {
  foreignKey: "receiver_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

db.transactions.belongsTo(db.projects, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

db.payment_accounts.belongsTo(db.user, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.user.belongsToMany(db.categories, { through: "user_subcategory" });
db.subcategories.belongsToMany(db.user, { through: "user_subcategory" });

db.issues.belongsTo(db.user, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


db.issues.belongsTo(db.projects, {
  foreignKey: 'project_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

db.projects_reports.belongsTo(db.projects, {
  foreignKey: {
    name: "project_id",
    // unique: true
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.projects_notis.belongsTo(db.projects, {
  foreignKey: {
    name: "project_id",
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.projects_notis.belongsTo(db.user, {
  foreignKey: {
    name: "creator_id",
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})


db.projects_notis.belongsTo(db.projects_reports, {
  foreignKey: {
    name: "report_id",
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.projects.belongsTo(db.subcategories, {
  foreignKey: "tag_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.projects.belongsTo(db.freelancer_post, {
  foreignKey: {
    name: "created_contact_id",
    allowNull: true,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.projects.belongsTo(db.bid, {
  foreignKey: {
    name: "created_bid_id",
    allowNull: true,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.projects.belongsTo(db.user, {
  foreignKey: 'owner_id',
  as: 'owner',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.projects.belongsTo(db.user, {
  foreignKey: 'member_id',
  as: 'member',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

// --------------------------------------------------------
db.bid.belongsTo(db.user, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.bid.belongsTo(db.project_post, {
  foreignKey: "proj_post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.bid.belongsTo(db.subcategories, {
  foreignKey: "skill_tag",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.comment_proj.belongsTo(db.project_post, {
  foreignKey: "proj_post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.comment_proj.belongsTo(db.user, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.comment_proj.belongsTo(db.user,{
  foreignKey: "parent_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

db.comment_proj.belongsTo(db.comment_proj, {
  foreignKey: {
    name: "parent_id",
    allowNull: true,
    defaultValue: null,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.project_post.belongsTo(db.user, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// db.project_post.hasMany(db.image, {
//   foreignKey: 'img_id',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE'
// })

db.review.belongsTo(db.user, {
  foreignKey: "user_review",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.review.belongsTo(db.user, {
  foreignKey: "user_reviewed",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.hasMany(db.review, {
  foreignKey: "user_review",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.user.hasMany(db.review, {
  foreignKey: "user_reviewed",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.project_post.belongsTo(db.subcategories, {
  foreignKey: 'tag_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})


// --------------------------------------------------------

db.user_wishlist.belongsTo(db.user, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

db.user_wishlist.belongsTo(db.project_post, {
  foreignKey: 'project_post_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

module.exports = db;
