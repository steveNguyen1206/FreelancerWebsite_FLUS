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
// const { create } = require("@mui/material/styles/createTransitions");

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
require("./app/routes/project_issues.routes")(app);
require("./app/routes/wishlist.routes")(app);
require("./app/routes/bid.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/user_subcategory.routes")(app);
require("./app/routes/issue.routes")(app);
require("./app/routes/payment_account.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// bo qua day cho giong code mau ne


function initial() {


  const handcraft = {
    name: "Handcraft",
    img: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705560777/z8jxbetforwgfyhqtncr.png",
    subcategories: [ {
        subcategory_name: "Knitting",
      },
      {
        subcategory_name: "Woodwork",
      }
    ]
  }

  const Photography = {
    name: "Photography",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705560837/zue7keaawcxyd3g1kwyt.png",
    subcategories: [ {
        subcategory_name: "Photo Edit",
      },
      {
        subcategory_name: "Photograph",
      }
    ]
  }

  const Business = {
    name: "Business",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705560852/riy1mzghlg73lqih4gdb.png",
    subcategories: [ {
        subcategory_name: "Business Plans",
      },
      {
        subcategory_name: "Business Consulting",
      }
    ]
  }

  const Data = {
    name: "Data",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705560987/mm74mcjl2qzugkndtont.png",
    subcategories: [ {
        subcategory_name: "Data Crawling",
      },
      {
        subcategory_name: "Data Analytics",
      }
    ]
  }

  const Marketing = {
    name: "Marketing",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705561058/v21jpgc4xv4mhhfhr2xs.png",
    subcategories: [ {
        subcategory_name: "CRM Marketing",
      }
    ]
  }

  const VideoAndAnimation = {
    name: "Video & Animation",
    img: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705560807/sfad6hrmg8rwwmx5gene.png ",
    subcategories: [ {
        subcategory_name: "Video Edit",
      },
      {
        subcategory_name: "Filming",
      }
    ]
  }
  
  const MusicAndAudio = {
    name: "Music & Audio",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705560819/ysr6dmyc4gfmauyxexn8.png",
    subcategories: [ {
        subcategory_name: "Voice-over",
      },
      {
        subcategory_name: "Music Producing",
      }
    ]
  }

  const ProgrammingAndTech = {
    name: "Programming & Tech",
    img: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705560972/b43m6ops5nqj5ljup4gn.png",
    subcategories: [ {
        subcategory_name: "Java development",
      },
      {
        subcategory_name: "HTML & CSS development",
      }
    ]
  }

  const WritingAndTranslation = {
    name: "Writing & Translation",
    img: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705562797/hjhovpkarfqn3mg1yuek.png",
    subcategories: [ {
        subcategory_name: "English translation",
      },
      {
        subcategory_name: "Seeding",
      }
    ]
  }

  const GraphicAndDesign = {
    name: "Graphic & Design",
    img: " https://res.cloudinary.com/dunbnutmw/image/upload/v1705561097/jkhm9n73jekdzdhfqkjq.png",
    subcategories: [ {
        subcategory_name: "Special Effect Design",
      }
    ]
  }

  const categoryData = [
    handcraft,
    Photography,
    Business,
    Data,
    Marketing,
    VideoAndAnimation,
    MusicAndAudio,
    ProgrammingAndTech,
    WritingAndTranslation,
    GraphicAndDesign
  ]

  const create_category = () => {
  categoryData.forEach((category) => {
  db.categories.create(
    category,
    { include: [ db.subcategories ] }
  );
  });
  }
  let subcategories = {};

  // const subcategories = {
  // "Woodwork"           :  1,
  // "Business Plans"     :  2,
  // "Business Consulting" :  3,
  //  "Knitting"           :  4,
  //  "Video Edit"         :  5,
  //  "Filming"            :  6,
  //  "Voice-over"         :  7,
  //  "Music Producing"    :  8,
  //  "Photo Edit"         :  9,
  //  "Photograph"         : 10,
  //  "Data Crawling"      : 11,
  //  "Data Analytics"     : 12,
  //  "CRM Marketing"      : 13,
  //  "Java development"   : 14,
  //  "HTML & CSS development" : 15,
  //  "English translation": 16,
  //  "Seeding"            : 17,
  //  "Special Effect Design" : 18
  // }




  const post1 =  { 
    id: 1,
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705563786/tpnydwcpblelsstxajha.gif",	
    skill_tag:  "Filming",
    title: "I will create a commercial video product for amazon, social media, website",
    about_me: "We are pleased to welcome you to our sunny island of Cyprus with its diverse natural landscape. \nIf you are in search of creating an elite brand video, such as Dior, Chanel, Valentino, Hugo Boss, Tom Ford, etc., but there are no opportunities yet. Then our team of professionals with many years of experience will help make your dreams come true and give a new impetus to growth for your business.",  
    skill_description: 
    "Our team and capabilities:\n- professional screenwriters and editing directors, vudeographers.\n- modern equipment (sound, lighting, studio, 4k cameras)\n- high-quality specialists in 2D and 3D graphics, motion designers.\n- professional models, actors, TV voise overs\n- assistants (stylists, makeup artists, lighting technicians)\n- a variety of natural locations (mountains, sea, metropolis, vast fields,rocks) palaces, castles, luxury villas, offices.\n- exclusive music from premium sources.",
    lowset_price: 200,
    delivery_due: 14,
    revision_number:	3,
    delivery_description: "- Concept development\n- Up to 1 shooting day\n- Up to 1 minute running time\n- 1 version included\n- Video editing",
    freelancer_id: 2
  }

  const post2 =  { 
    id: 2,
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705564820/zxv6ciusyigpnqccawrz.png", 	
    skill_tag:  "Java development",
    title: "I will help in java and c programming projects",
    about_me: "Greetings, I'm Tuba—an accomplished developer with over 5 years of expertise in crafting desktop and web applications. My focus is on designing intuitive interfaces and constructing robust backend systems. With a proven track record of over 70 successfully completed projects, I've had the privilege of collaborating with foreign companies on cutting-edge initiatives. If you're grappling with any development challenges, I'm here to offer my seasoned experience and bring your ideas to life.",  
    skill_description: 
    "Welcome to Expert Java Programming Services!\nAre you in need of top-notch Java solutions, meticulously crafted code, and a stellar architecture? Look no further!\nAs a seasoned Java programmer with over 4 years of experience, I am well-equipped to handle both simple and complex projects to meet your unique requirements.\nWhat This Gig Offers:\nJAVA:\nJava GUI Applications\nJava Console-based Applications/Tasks\nDatabase Integration with Java Projects/Applications\nError Fixing and Code Debugging",
    lowset_price: 300,
    delivery_due: 14,
    revision_number:	2,
    delivery_description: "- Source code\n- Detailed code comments",
    freelancer_id: 2
  }

  const post3 =  { 
    id: 3,
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705564850/vhkacwjimtkgrsy87xha.png",	
    skill_tag:  "Woodwork",
    title: "I will design wood working furniture using blender	",
    about_me: "We are pleased to welcome you to our sunny island of Cyprus with its diverse natural landscape. \nIf you are in search of creating an elite brand video, such as Dior, Chanel, Valentino, Hugo Boss, Tom Ford, etc., but there are no opportunities yet. Then our team of professionals with many years of experience will help make your dreams come true and give a new impetus to growth for your business.",  
    skill_description: 
    "Hi everyone! Thank you for visiting.\nI'm DAGIM, a professional architect visualization artist with 4 years of experience in 3d design \nand I also have experience in teaching 3d visualization for more than 3 years in my course.  \nMy specialization is in Sketchup, Lumion, and Blender.\ni can help you with    \nFurniture Design    \nFurniture Design    \nFurniture Design    \nFurniture Design    \nFurniture Design\nLet me help you realize the highest quality modeling, most realistic rendering, and landscaping.",
    lowset_price: 150,
    delivery_due: 31,
    revision_number:	2,
    delivery_description: "- 3D modeling\n- 1 3D render\n- Texturing & lighting\n- Source file",
    freelancer_id: 1
  }

  const freelacer_posts = [post1, post2, post3]

  const create_freelancer_post = async (mysubcategories) => {
    console.log(mysubcategories);
    freelacer_posts.forEach((post) => {
    post.skill_tag = mysubcategories[post.skill_tag];
    db.freelancer_post.create(
      post,
      { include: [ db.subcategories ] }
    );
    }); 
  } 

  const projPost1 = { 
    id: 1,
    title: 	"Embedded Software Developer",
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705567368/x7ybiq4fieolx0f347ne.jpg",
    detail: "MUST HAVE:\n- Bachelor’s Degree or above in Electronic Engineering, Telecommunication, Computer Science, Computer Engineering, Automation, Information Technology or equivalent.\n\nCOMPANY BENEFITS\n-13th Salary + Performance Bonus.\n-Pass probation Bonus.\n-Premium healthcare insurance benefits (PVI Insurance package) and family medical benefit (based on the level of experience).\n-Holiday celebrations and parties for team members and family.",
    tag_id: "Java development",
    start_date:	'2024-12-02',
    budget_min:	1000,
    budget_max:	2000,
    user_id: 2,
    status: 1
  }

  const projPost2 = { 
    id: 2,
    title: 	"Business Analyst",
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705567647/qcv80tjxggpaidjptbpd.jpg",
    detail: "1. Qualifications:\n- Bachelor’s degree in computer science or related business qualification\n\n2. Experience:\n- Minimum 3+ years’ experience in business analysis or related fields.\n\n3. Capabilities:\n- Strong English communication skills and ability to collaborate with team members.\n- Ability to work independently and raise questions, fill requirements.\n\n** BENEFITS:\n- Dynamic and professional working environment.\n- 13th&14th month salary.",
    tag_id: "Data Analytics",
    start_date:	'2024-05-15',
    budget_min:	1500,
    budget_max:	3000,
    user_id: 1,
    status: 1
  }

  const projPost3 = {
    id: 3, 
    title: 	"Fresher HTML - CSS Developer",
    imgage_post_urls: "https://res.cloudinary.com/dunbnutmw/image/upload/v1705567748/hqy57sdc1z3p04hdf85g.jpg",
    detail: "- Bachelor or Master degree within a relevant IT specialization\n- Good English skills both in writing and verbally\n- Basic understanding of and practical experience with object-oriented programming and data modelling\n- Familiar with various design, architectural patterns and modern system development\n- Open towards and able to quickly learn new technologies\n- Ability to work both independently and team\n- Professional pro-active attitude, taking responsibility and initiative",
    tag_id: "HTML & CSS development",
    start_date:	'2024-09-10',
    budget_min:	500,
    budget_max:	1000,
    user_id: 3,
    status: 1
  }

  const projPostsList = [projPost1, projPost2, projPost3]

  const create_project_post = (data) => {
    projPostsList.forEach((post) => {
      post.tag_id = data[post.tag_id];
    db.project_post.create(
      post,
      { include: [ db.subcategories ] }
    );
    });
  }


  const bid1_1 = {
    price: 1500,
    message:	"I am eager to apply for the Embedded Software Developer role at your company. With a Bachelor’s Degree in Computer Science and over a year of experience in Embedded Software development, I bring proficiency in C/C++, Python, Java core, and Object-Oriented Programming. Your company's focus on employee development aligns with my career goals. Excited about the prospect of contributing to your team's success, I appreciate your consideration.",
    duration:	15,
    email:	"lethanhdat0246@gmail.com",
    status: 0,
    skill_tag: "Java development",
    user_id: 1,
    proj_post_id: 1
  }
  
  const bid1_2 = {
    price: 1350,
    message:	"I'm eager to express my interest in the Embedded Software Developer role. Armed with a Bachelor's in Computer Science and 1+ year experience, I excel in C/C++, Python, Java, and OOP. Proficient in Eclipse and well-versed in hardware, I thrive under pressure, exhibit teamwork and leadership, and communicate fluently in English. Excited about contributing to your esteemed company, I eagerly anticipate the chance to discuss my candidacy further.",
    duration:	25,
    email:	"21120427@student.hcmus.edu.vn",
    status: 0,
    skill_tag: "Java development",
    user_id: 2,
    proj_post_id: 1
  }
  const bid1_3 = {
    price: 1860,
    message:	"Dear Hiring Manager,\nI'm writing to express interest in the Embedded Software Developer role. With a Bachelor’s in Computer Science and 2+ years of C/C++ programming for Embedded Software, I possess the required technical skills. Proficient in Java, Python, and IDEs like Eclipse, I excel in teamwork and thrive under pressure. My passion for embedded systems aligns with the comprehensive benefits your company offers. I eagerly anticipate the opportunity to contribute to your team.",
    duration:	13,
    email:	"ledat161003@gmail.com",
    status: 0,
    skill_tag: "Java development",
    user_id: 3,
    proj_post_id: 1
  }
  
  const bid2_1 = {
    price: 2550,
    message:	"I am excited to apply for the Business Analyst position - Data Analytics. With a Bachelor's in computer science and 3+ years of business analysis experience, I excel in analyzing financial data, crafting structured requirements, and utilizing relational databases. Proficient in Jira and Confluence, my strong communication and problem-solving skills align seamlessly with the requirements for this role. I look forward to leveraging my analytical expertise to drive success.",
    duration:	16,
    email:	"lethanhdat0246@gmail.com",
    status: 0,
    skill_tag: "Data Analytics",
    user_id: 1,
    proj_post_id: 2
  }
  
  const bid2_2 = {
    price: 2990,
    message:	"I'm applying for the Business Analyst role with a Computer Science degree and 3+ years of experience. Skilled in analyzing business data, crafting requirements, and using Jira/Confluence. Excited about contributing to a professional team and discussing how my skills align with your Data Analytics project needs.",
    duration:	15,
    email:	"21120427@student.hcmus.edu.vn",
    status: 0,
    skill_tag: "Data Analytics",
    user_id: 2,
    proj_post_id: 2
  }
  const bid2_3 = {
    price: 1730,
    message:	"Dear Hiring Team,\nI'm interested in the Business Analyst role. With a Bachelor\'s in computer science and 3+ years in business analysis, I excel in data analysis, product requirement creation, and use of tools like Jira. Confident in my problem-solving skills, I look forward to discussing how I can contribute to your dynamic team and align with your project\'s needs.",
    duration:	25,
    email:	"ledat161003@gmail.com",
    status: 0,
    skill_tag: "Data Analytics",
    user_id: 3,
    proj_post_id: 2
  }
  
  const bid3_1 = {
    price: 550,
    message:	"Hello! Recent IT grad with a Master's, I'm eager for the HTML & CSS Developer role. Strong in OOP and data modeling, my proactive approach ensures timely, quality work. Ready to adapt swiftly to new technologies, I'm excited to contribute to your international team.",
    duration:	28,
    email:	"lethanhdat0246@gmail.com",
    status: 0,
    skill_tag: "HTML & CSS development",
    user_id: 1,
    proj_post_id: 3
  }
  
  const bid3_2 = {
    price: 620,
    message:	"Greetings! As a Bachelor's degree holder in IT, I am thrilled to apply for the HTML & CSS Developer role. My English proficiency, combined with a basic understanding of modern system development, makes me a suitable candidate. I am open to learning new technologies, and my collaborative spirit aligns well with the international team dynamic. Looking forward to bringing my skills and initiative to your esteemed project.",
    duration:	25,
    email:	"21120427@student.hcmus.edu.vn",
    status: 0,
    skill_tag: "HTML & CSS development",
    user_id: 2,
    proj_post_id: 3
  }
  const bid3_3 = {
    price: 780,
    message:	"Hello! I'm a dedicated IT graduate pursuing the HTML & CSS Developer role. Armed with theoretical and practical design pattern experience, I work independently with a proactive mindset, ensuring timely and quality deliverables. Eager to contribute my skills to your team, I look forward to professional growth in a dynamic environment.",
    duration:	22,
    email:	"ledat161003@gmail.com",
    status: 0,
    skill_tag: "HTML & CSS development",
    user_id: 3,
    proj_post_id: 3
  }
  
  const bidList = [bid1_1, bid1_2, bid1_3, bid2_1, bid2_2, bid2_3, bid3_1, bid3_2, bid3_3]
  const create_bid = (data) => {
    bidList.forEach((bid) => {
      bid.skill_tag = data[bid.skill_tag];
    db.bid.create(
      bid,
      { include: [ db.subcategories ] }
    );
    });
  }


  const contact1_1 = {
    client_name: "Micheal John"	,
    client_company: "Beta Cinema",
    job_name: "Product advertising filming",
    job_description: "Shoot a stunning video ad for our next product in our private studios.\nIn the video, there can be as many cameos as you want.\nProps or hand models is allowed to be hired.\nDo not use previously created idea from other products of this industry's competitors.",
    budget: 223,
    start_date:	"2024-02-14",
    end_date: "2024-03-15",
    status: 0,
    freelancer_post_id: 1,
    client_id: 1,
  }

  const contact1_2 = {
    client_name: "Jessica Glyne"	,
    client_company: "Lotte Cinema",
    job_name: "Film a short video for new combo campaign",
    job_description: "We hope this message finds you well. We are currently seeking a talented and creative freelance filmmaker to join our team and contribute to the production of engaging and captivating video content. If you're passionate about storytelling through visuals and have a keen eye for detail, we'd love to hear from you.",
    budget: 200,
    start_date:	"2024-01-31",
    end_date: "2024-02-29",
    status: 0,
    freelancer_post_id: 1,
    client_id: 2,
  }

  const contact1_3 = {
    client_name: "Dexter Van"	,
    client_company: "CGV Cineplex",
    job_name: "Produce ad video for out campaign",
    job_description: "We hope this message finds you well. We are currently seeking a talented and creative freelance filmmaker to join our team and contribute to the production of engaging and captivating video content. If you're passionate about storytelling through visuals and have a keen eye for detail, we'd love to hear from you.",
    budget: 250,
    start_date:	"2024-01-02",
    end_date: "2024-03-31",
    status: 0,
    freelancer_post_id: 1,
    client_id: 3,
  }
  const contact2_1 = {
    client_name: "Jessi Moore"	,
    client_company: "ABC Corp.",
    job_name: "Create mobile store",
    job_description: "Job Title: Java Developer - Pastry Paradise App\n\nRole: Sweeten our bakery's success! Seeking a skilled Java developer to create a mobile app for seamless orders, loyalty rewards, and a delightful customer experience. Join us in adding a tech twist to the world of pastries! Apply now! #BakeryTech #JavaDeveloper #NowHiring",
    budget: 223,
    start_date:	"2024-02-14",
    end_date: "2024-03-15",
    status: 0,
    freelancer_post_id: 2,
    client_id: 1,
  }
  const contact2_2 = {
    client_name: "Micheal Desti"	,
    client_company: "Givral Corp.",
    job_name: "Create mobile store",
    job_description: "Job Title: Java Developer - Pastry Paradise App\n\nRole: Sweeten our bakery's success! Seeking a skilled Java developer to create a mobile app for seamless orders, loyalty rewards, and a delightful customer experience. Join us in adding a tech twist to the world of pastries! Apply now! #BakeryTech #JavaDeveloper #NowHiring",
    budget: 223,
    start_date:	"2024-01-31",
    end_date: "2024-02-29",
    status: 0,
    freelancer_post_id: 2,
    client_id: 2,
  }
  const contact2_3 = {
    client_name: "Vienna Mouse"	,
    client_company: "Givral Corp.",
    job_name: "Create mobile store",
    job_description: "Job Title: Java Developer - Pastry Paradise App\n\nRole: Sweeten our bakery's success! Seeking a skilled Java developer to create a mobile app for seamless orders, loyalty rewards, and a delightful customer experience. Join us in adding a tech twist to the world of pastries! Apply now! #BakeryTech #JavaDeveloper #NowHiring",
    budget: 223,
    start_date:	"2024-01-02",
    end_date: "2024-03-31",
    status: 0,
    freelancer_post_id: 2,
    client_id: 3,
  }
  const contact3_1 = {
    client_name: "Joshua Moore"	,
    client_company: "Brother de Carpenter",
    job_name: "Wood Statue  Sculpture",
    job_description: "Job Title: Woodworker - Brother de Carpenter \n\nRole: Craftsmanship Wanted! Join our team as a skilled Woodworker. Shape exquisite pieces, bring designs to life, and contribute to the artistry of Brother de Carpenter. If you have a passion for woodcraft, precision, and creativity, apply now!  #Woodworker #NowHiring",
    budget: 223,
    start_date:	"2024-02-14",
    end_date: "2024-03-15",
    status: 0,
    freelancer_post_id: 3,
    client_id: 1,
  }
  const contact3_2 = {
    client_name: "Jack Frost"	,
    client_company: "TheWoods",
    job_name: "Wood Stature for Ceremony",
    job_description: "Job Title: Wood Sculptor - TheWoods \n\nRole: Channel your artistry into legacy! Join TheWoods as our Wood Sculptor to craft an iconic statue for our grand opening. Your expertise will shape the heart of our ceremony, transforming wood into a symbol of excellence. If you're passionate about sculpting stories in timber, bring your talent to TheWoods family. Apply now and leave an enduring mark in woodcraft history",
    budget: 200,
    start_date:	"2024-01-31",
    end_date: "2024-02-29",
    status: 0,
    freelancer_post_id: 3,
    client_id: 2,
  }
  const contact3_3 = {
    client_name: "Jack Jouhnson",
    client_company: "TheWoods",
    job_name: "Wood Stature for Dinner",
    job_description: "Job Title: Wood Sculptor - TheForests \n\nRole: Channel your artistry into legacy! Join TheWoods as our Wood Sculptor to craft an iconic statue for our grand opening. Your expertise will shape the heart of our ceremony, transforming wood into a symbol of excellence. If you're passionate about sculpting stories in timber, bring your talent to TheWoods family. Apply now and leave an enduring mark in woodcraft history",
    budget: 250,
    start_date:	"2024-01-02",
    end_date: "2024-03-31",
    status: 0,
    freelancer_post_id: 3,
    client_id: 3,
  }

  const contactList = [contact1_1, contact1_2, contact1_3, contact2_1, contact2_2, contact2_3, contact3_1, contact3_2, contact3_3]
  const create_contact = () => {
    contactList.forEach((contact) => {
    db.contact.create(
      contact
    );
    });
  };


  // Getsubcategories().then((data) => {
    // subcategories = data;
    // create_freelancer_post(data);
    // console.log(data);
  // create_project_post();
  // create_bid();
  // create_contact();


  const Getsubcategories = async () => {
    db.subcategories.findAll({
      attributes: ['subcategory_name', 'id']
    }).then((subcategories_data) => {
       const subcategories = {}

      subcategories_data.forEach((subcategory) => {
        subcategories[subcategory.subcategory_name] = subcategory.id;
      }
      );
      console.log(subcategories);
      // create_freelancer_post(subcategories);
      // create_project_post(subcategories);
      // create_bid(subcategories);
      create_contact(subcategories);

      // create_project_post(subcategories);
      return subcategories;
    });
  }
// 1: 
  // create_category();

  // 2.
  Getsubcategories();

  // });

  
}

// initial();