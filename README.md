
# **Freelancer Website: FLUS**

## **I. About this project:**

Freelancer website is a platform that connects freelancers with clients who need to hire services. A Freelancer website needs to help freelancers find projects that suit their skills, experience, and interests, and can be flexible in working time and location, without being bound by any company. At the same time, Clients can save costs when hiring freelancers instead of recruiting official employees, and can track project progress and results easily and transparently. To meet these growing needs, our team built a Freelancer website called FLUS (Freelancer US).

The features of the website include: 

* Register and Login.
* Register and Log in with Google
* Display general list, including: List of projects by recruitment field, Freelancer by skill,...
* Filter Freelancers by price, skills,... and filter recruitment posts according to Freelancer wishes (skills, time, location,...), sort by likes,...
* Search bar.
* Payment
* Notification via Gmail
* Create a post for each project with specification information (skill requirements, time, quantity...) and interactions with the post: comment asking for more information, apply, follow, like,... .
* Check the list of Freelancers applied to the project.
* Provides features to manage project progress and manage project members during the project.
* Reporting and evaluating employers.
* Review and report violations of Freelancer.
* Bidding in Client's posted projects.
* Product censorship.
* Delete or ban users.
* Delete or hide posts.
* Delete/Add Category, SubCategory.
* Accept/Reject complaint
* Mark projects of interest
* Website statistics (number of users, number of people getting jobs via the web).
## **II. Architecture:**
* Frontend uses ReactJS Framework and HTML5, CSS.
* Backend uses NodeJS Express Server.
* Using MySQL server.
* Client devices have a web browser installed that supports HTML5, CSS and Javascript ES5.
* Microservices APIs include Google login, Cloudinary, Gmail, Paypal, and Twilio Phone Verification.

## **III. How to run:**
Firstly, clone the GitHub repository to your local workspace.

### **1. Backend server:**
* Run the MySQL server. In this project, MySQL Workbench or XAMPP Control Panel is used to activate the MySQL Database.
* Get to the backend directory using the command: `cd BackEnd`
* Install necessary packages using: `npm install `
* Run: `npm start`
### **2. Frontend server:**
* Get to the frontend directory using the command: `cd Frontend-Folder-Structure`
* Install necessary packages using: `npm install `
* Run: `npm start`