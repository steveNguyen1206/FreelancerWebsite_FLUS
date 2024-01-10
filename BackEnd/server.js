const express = require("express");
const cors = require("cors");
require('dotenv').config();
   

const app = express();


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/paypal.routes")(app);

require('./app/routes/auth.routes')(app);
require("./app/routes/user.routes")(app);
require("./app/routes/sms.routes")(app);
require("./app/routes/gmail.routes")(app);
require("./app/routes/freelancer_post.routes")(app);
require("./app/routes/project_post.routes")(app);

require("./app/routes/project_report.routes")(app);
require("./app/routes/project_notification.routes")(app);
require("./app/routes/review.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/contact.routes")(app);
require("./app/routes/subcategory.routes")(app);
require("./app/routes/project.routes")(app);
require("./app/routes/wishlist.routes")(app);
require("./app/routes/bid.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/user_subcategory.routes")(app);
require("./app/routes/project_issues.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// bo qua day cho giong code mau ne
// const Role = db.role;

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });
 
//   Role.create({
//     id: 2,
//     name: "moderator"
//   });
 
//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }